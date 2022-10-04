/* eslint-disable jest/no-export */
import { cp, mkdtemp, rm } from "fs/promises"
import { createTypescriptThing, Options } from "index"
import { tmpdir } from "os"
import { join } from "path"
import { sh } from "sh"
import { sortAndStringify } from "sortAndStringify"

type TestOptions = Omit<Options, "path"> & {
  /** Run npm (or yarn or pnpm) install */
  install?: boolean
  /** Return the real path. You should not mutate the contents there, as that will affect other tests */
  getOriginalPath?: boolean
  /** Use the contents of this path as the base. Implies `update` */
  updateFrom?: string
}

const cachedPaths: Record<string, Promise<string>> = {}

export const defaultTestOptions: TestOptions = {
  name: "testpackage",
  type: "library",
  gitOrigin: "git@github.com:isomorphic-git/test.empty.git",
  gitBranch: "master",
  packageManager: "npm",
  disableGitCommits: false,
  disableGitRepo: false,
  install: false,
}

export const getPreparedPath = async (partialOptions: Partial<TestOptions>) => {
  const { getOriginalPath, ...options } = { ...defaultTestOptions, ...partialOptions }
  options.update = options.update ?? !!options.updateFrom
  const optionsHash = sortAndStringify(options)

  if (!cachedPaths[optionsHash]) {
    const createPreparedPath = async (options: TestOptions) => {
      const { install, ...optionsWithoutInstall } = options
      if (install) {
        const packageManager = optionsWithoutInstall.packageManager || "npm"
        const dir = await getPreparedPath(optionsWithoutInstall)
        if (options.packageManager === "pnpm") {
          // pnpm does not need an extra install step
          return dir
        }
        try {
          await sh(`cd ${dir} ; nix develop --command ${packageManager} install --frozen-lockfile`)
          return dir
        } catch (e) {
          await rm(dir, { recursive: true })
          throw e
        }
      }

      const dir = await mkdtemp(join(tmpdir(), "cttl-test-"))
      try {
        if (options.updateFrom) {
          await cp(options.updateFrom, dir, { recursive: true })
        }
        await createTypescriptThing({ ...optionsWithoutInstall, path: dir })
        return dir
      } catch (e) {
        await rm(dir, { recursive: true })
        throw e
      }
    }
    cachedPaths[optionsHash] = createPreparedPath(options)
  }

  const templatePath = await cachedPaths[optionsHash]
  if (getOriginalPath) {
    return templatePath
  }
  const dir = await mkdtemp(join(tmpdir(), "cttl-test-"))
  await cp(templatePath, dir, { recursive: true, preserveTimestamps: true })
  return dir
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cleanupCache = async () => {
  const paths = await Promise.allSettled(Object.values(cachedPaths))
  paths.forEach(path => {
    if (path.status === "fulfilled") {
      rm(path.value, { recursive: true })
    }
  })
}

export const runInDirectory = async <T>(options: Partial<TestOptions>, testFunction: (dir: string) => T) => {
  const dir = await getPreparedPath(options)
  try {
    await testFunction(dir)
  } finally {
    await rm(dir, { recursive: true })
  }
}
