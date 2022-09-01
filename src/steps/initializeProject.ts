import fs from "fs"
import { addToIgnoreFile } from "helpers/addToIgnoreFile"
import { loadExistingFile } from "helpers/loadExistingFile"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { commit, findRoot, listRemotes } from "isomorphic-git"
import { normalize, relative, resolve } from "path"
import { PackageJson } from "types-package-json"

export const initializeProject = async (
  targetDir: string,
  name: string,
  version: string,
  description: string | undefined,
  authorName: string | undefined,
  authorEmail: string | undefined,
  license: string | undefined
) => {
  const previousPackage = JSON.parse(
    (await loadExistingFile(targetDir, "package.json")) || "{}"
  ) as Partial<PackageJson>
  const packageJson = {
    ...previousPackage,
    name,
    version,
    description,
    ...(authorName || authorEmail ? { author: { name: authorName, email: authorEmail } } : {}),
    repository: await getRepositoryInformation(targetDir),
    license,
  }

  await writeAndAddFile(targetDir, "package.json", JSON.stringify(packageJson, null, 2))

  const gitIgnoreContent = (await loadExistingFile(targetDir, ".gitignore")) || ""
  const newGitIgnoreContent = addToIgnoreFile(gitIgnoreContent, "node", "node_modules")
  await writeAndAddFile(targetDir, ".gitignore", JSON.stringify(newGitIgnoreContent, null, 2))

  await commit({ fs, dir: targetDir, message: "Add nix shell" })
}

const getRepositoryInformation = async (targetDir: string) => {
  const remotes = await listRemotes({ fs, dir: targetDir })
  const origin = remotes.find(remote => remote.remote === "origin")?.url

  if (!origin) {
    throw new Error("Currently you need a git remote")
  }

  const gitRoot = await findRoot({ fs, filepath: targetDir })
  const absoluteTargetDir = normalize(resolve(process.cwd(), targetDir))
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
