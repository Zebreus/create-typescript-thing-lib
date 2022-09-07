import { ensureGitRepo } from "helpers/ensureGitRepo"
import { prepareTargetDir } from "helpers/prepareTargetDir"
import { PackageManager } from "install-pnpm-package/dist/detectPackageManager"
import { normalize, resolve } from "path"
import { addEslint } from "steps/addEslint"
import { addHusky } from "steps/addHusky"
import { addJest } from "steps/addJest"
import { addLintStaged } from "steps/addLintStaged"
import { addNixShell } from "steps/addNixShell"
import { addPrettier } from "steps/addPrettier"
import { addTypescript } from "steps/addTypescript"
import { addVscodeSettings } from "steps/addVscodeSettings"
import { initializeProject } from "steps/initializeProject"
import { setupApplication } from "steps/setupApplication"
import { setupLibrary } from "steps/setupLibrary"

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
  /** Select the flavor of lockfiles you want. Also the nix file will install this packagemanager.
   * @default "npm"
   */
  packageManager?: PackageManager
}

export const createTypescriptThing = async ({
  path,
  name,
  description,
  type,
  //   monorepo = false,
  repo,
  branch = "main",
  authorName,
  authorEmail,
  packageManager = "npm",
}: Options) => {
  const targetDir = normalize(resolve(process.cwd(), path || name || "."))
  await prepareTargetDir(targetDir)
  await ensureGitRepo(targetDir, repo, branch)
  await addNixShell(targetDir)
  await initializeProject(targetDir, name, "0.0.0", description, authorName, authorEmail, "MIT")
  await addTypescript(targetDir, packageManager)
  await addPrettier(targetDir, packageManager)
  await addEslint(targetDir, packageManager)
  await addJest(targetDir, packageManager)
  await addLintStaged(targetDir, packageManager)
  await addHusky(targetDir, packageManager)
  await addVscodeSettings(targetDir)
  if (type === "library") {
    await setupLibrary(targetDir, packageManager)
  }
  if (type === "application") {
    await setupApplication(targetDir, packageManager, name)
  }
}

export default createTypescriptThing
