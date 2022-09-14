import fs from "fs"
import { addToGitIgnore } from "helpers/addToGitIgnore"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { loadExistingFile } from "helpers/loadExistingFile"
import { withStateLogger } from "helpers/withStateLogger"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { findRoot, listRemotes } from "isomorphic-git"
import { normalize, relative, resolve } from "path"
import { PackageJson } from "types-package-json"

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
    const previousPackage = JSON.parse((await loadExistingFile(config, "package.json")) || "{}") as Partial<PackageJson>
    const repositoryInformation = await getRepositoryInformation(config)
    const packageJson = {
      ...previousPackage,
      name,
      version,
      description,
      ...(authorName || authorEmail ? { author: { name: authorName, email: authorEmail } } : {}),
      repository: repositoryInformation,
      license,
    }

    await writeAndAddFile(config, "package.json", JSON.stringify(packageJson, null, 2))

    await addToGitIgnore(config, "node", ["node_modules", "yarn-error.log"])

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
    type: "git",
    url: httpsGitOrigin,
    projectLocationRelativeToGitRoot: gitDirectory,
  }
}
