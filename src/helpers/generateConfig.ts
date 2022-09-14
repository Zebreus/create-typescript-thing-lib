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
  name: string
  packageManager: PackageManager
  git: boolean
}

export const generateConfig = async (config: Options): Promise<Config> => {
  return {
    targetDir: normalize(resolve(process.cwd(), config.path || config.name || ".")),
    name: config.name,
    packageManager: config.packageManager ?? "npm",
    git: config.disableGit ? false : true,
  }
}
