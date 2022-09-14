import { addPackageJsonToGit } from "helpers/addPackageJsonToGit"
import { Config } from "helpers/generateConfig"
import { addPackage } from "install-pnpm-package"

export const installPackage = async (config: Config, packageName: string | string[], options?: { prod?: boolean }) => {
  const packages = Array.isArray(packageName) ? packageName : [packageName]

  await addPackage(packages, {
    directory: config.targetDir,
    type: options?.prod ? "normal" : "dev",
    packageManager: config.packageManager,
  })

  await addPackageJsonToGit(config)
}
