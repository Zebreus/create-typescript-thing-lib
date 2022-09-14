import { addPackageJsonToGit } from "helpers/addPackageJsonToGit"
import { Config } from "helpers/generateConfig"
import { addPackage } from "install-pnpm-package"
import { PackageManager } from "install-pnpm-package/dist/detectPackageManager"

export const installPackage = async (
  config: Config,
  packageManager: PackageManager,
  packageName: string | string[],
  options?: { prod?: boolean }
) => {
  const packages = Array.isArray(packageName) ? packageName : [packageName]

  await addPackage(packages, {
    directory: config.targetDir,
    type: options?.prod ? "normal" : "dev",
    packageManager,
  })

  await addPackageJsonToGit(config)
}
