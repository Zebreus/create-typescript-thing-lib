import fs from "fs"
import { access } from "fs/promises"
import { formatFile } from "helpers/formatFileContent"
import { Config } from "helpers/generateConfig"
import { add } from "isomorphic-git"
import { relative, resolve } from "path"

export const addPackageJsonToGit = async (config: Config) => {
  if (!config.gitCommits) {
    return
  }
  const files = ["package.json", "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "npm-shrinkwrap.json"]
  const filePathPromises = files
    .map(file => resolve(config.targetDir, file))
    .map(async path => ({
      path,
      exists: await access(path)
        .then(() => true)
        .catch(() => false),
    }))
  const filePaths = (await Promise.all(filePathPromises)).filter(({ exists }) => exists).map(({ path }) => path)

  await Promise.all(filePaths.map(path => formatFile(config, path)))

  await Promise.all(
    filePaths.map(
      async filePath => await add({ fs, dir: config.targetDir, filepath: relative(config.targetDir, filePath) })
    )
  )
}
