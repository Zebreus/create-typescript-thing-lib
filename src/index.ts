import { ensureGitRepo } from "helpers/ensureGitRepo"
import { generateConfig } from "helpers/generateConfig"
import { prepareTargetDir } from "helpers/prepareTargetDir"
import { PackageManager } from "install-pnpm-package/dist/detectPackageManager"
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

export type Logger = {
  logMessage?: (message: string, options: { type?: "info" | "error" | "warning" | "success" }) => void
  logState?: (id: string, options: { text?: string; state?: "pending" | "active" | "completed" | "failed" }) => void
}

export type Options = {
  path: string
  name: string
  description?: string
  type: "library" | "application"
  authorName?: string
  authorEmail?: string
  /** Select the flavor of lockfiles you want. Also the nix file will install this packagemanager.
   * @default "npm"
   */
  packageManager?: PackageManager
  /** Do not create git commits */
  disableGitCommits?: boolean
  /** Do not create or modify a git repository. Set this, if the target dir is already inside a git repo. */
  disableGitRepo?: boolean
  gitOrigin?: string
  gitBranch?: string

  logger?: Logger
}

export const createTypescriptThing = async (options: Options) => {
  const { name, description, type, gitOrigin, gitBranch = "main", authorName, authorEmail } = options
  const config = await generateConfig(options)
  await prepareTargetDir(config)
  await ensureGitRepo(config, gitOrigin, gitBranch)
  await addNixShell(config)
  await initializeProject(config, name, "0.0.0", description, authorName, authorEmail, "MIT")
  await addTypescript(config)
  await addPrettier(config)
  await addEslint(config)
  await addJest(config)
  await addLintStaged(config)
  await addHusky(config)
  await addVscodeSettings(config)
  if (type === "library") {
    await setupLibrary(config)
  }
  if (type === "application") {
    await setupApplication(config)
  }
}

export default createTypescriptThing
