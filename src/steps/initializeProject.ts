import fs from "fs"
import { addToGitIgnore } from "helpers/addToGitIgnore"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { augmentJsonConfig } from "helpers/modifyJsonFile"
import { withStateLogger } from "helpers/withStateLogger"
import { findRoot, listRemotes } from "isomorphic-git"
import { normalize, relative, resolve } from "path"

export const initializeProject = withStateLogger(
  {
    id: "init",
    message: "Initializing package.json",
    completed: "Created package.json",
    failed: "Failed to create package.json",
  },
  async (
    config: Config,
    name: string,
    version: string,
    description: string | undefined,
    authorName: string | undefined,
    authorEmail: string | undefined,
    license: string | undefined
  ) => {
    const repositoryInformation = await getRepositoryInformation(config)
    const packageJson = {
      name,
      version,
      description,
      ...(authorName || authorEmail ? { author: { name: authorName, email: authorEmail } } : {}),
      repository: repositoryInformation,
      license,
      type: "module",
    }

    await augmentJsonConfig(config, "package.json", packageJson)

    await addToGitIgnore(config, "node", [
      "node_modules",
      "logs",
      "*.log",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      "lerna-debug.log*",
      ".pnpm-debug.log*",
      "/.pnp",
      ".pnp.js",
    ])

    await addToGitIgnore(config, "misc", [".DS_Store", "*.pem"])

    await commitWithAuthor(config, "Initialize node project")
  }
)

const getRepositoryInformation = async (config: Config) => {
  const remotes = await listRemotes({ fs, dir: config.targetDir }).catch(() => [])
  const origin =
    remotes.find(remote => remote.remote === "origin")?.url || remotes.find(remote => remote.remote === "upstream")?.url

  if (!origin) {
    return undefined
  }

  const gitRoot = await findRoot({ fs, filepath: config.targetDir })
  const absoluteTargetDir = normalize(resolve(process.cwd(), config.targetDir))
  const absoluteGitRootDir = normalize(resolve(process.cwd(), gitRoot))
  const projectLocationRelativeToGitRoot = relative(absoluteGitRootDir, absoluteTargetDir)

  const httpsGitOrigin = origin.replace(/git@([^:]+):(.+)\.git/, "https://$1/$2")

  const gitDirectory =
    normalize(projectLocationRelativeToGitRoot) === "." ? undefined : normalize(projectLocationRelativeToGitRoot)

  return {
    type: "git" as const,
    url: httpsGitOrigin,
    projectLocationRelativeToGitRoot: gitDirectory,
  }
}
