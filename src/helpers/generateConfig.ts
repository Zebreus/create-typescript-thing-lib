import { Options } from "index"
import { PackageManager } from "install-pnpm-package/dist/detectPackageManager"
import { normalize, resolve } from "path"

/**
 * There are some values that are basically required everywhere. This object bundles them.
 *
 * I just want to keep things here that define the environment that is required for some functions, but not the parameters of the function.
 */
export type Config = {
  targetDir: string
  packageManager: PackageManager
  gitCommits: boolean
  gitRepo: boolean
}

export const generateConfig = async (config: Options): Promise<Config> => {
  return {
    targetDir: normalize(resolve(process.cwd(), config.path || config.name || ".")),
    packageManager: config.packageManager ?? "npm",
    gitCommits: !config.disableGitCommits,
    gitRepo: !config.disableGitRepo,
  }
}
