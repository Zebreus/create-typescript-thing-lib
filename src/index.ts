import { ensureGitRepo } from "helpers/ensureGitRepo"
import { prepareTargetDir } from "helpers/prepareTargetDir"
import { normalize, resolve } from "path"
import { addNixShell } from "steps/addNixShell"
import { initializeProject } from "steps/initializeProject"

export type Options = {
  path: string
  name: string
  description?: string
  type: "library" | "application"
  monorepo: boolean
  repo: string
  branch?: string
  authorName?: string
  authorEmail?: string
}

export const createTypescriptThing = async ({
  path,
  name,
  description,
  //   type,
  //   monorepo = false,
  repo,
  branch = "main",
  authorName,
  authorEmail,
}: Options) => {
  const targetDir = normalize(resolve(process.cwd(), path || name || "."))
  await prepareTargetDir(targetDir)
  await ensureGitRepo(targetDir, repo, branch)
  await addNixShell(targetDir)
  await initializeProject(targetDir, name, "0.0.0", description, authorName, authorEmail, "MIT")
}

export default createTypescriptThing
