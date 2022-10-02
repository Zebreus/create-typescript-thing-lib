import { addPackageJsonToGit } from "helpers/addPackageJsonToGit"
import { Config } from "helpers/generateConfig"
import { getPackageVersion, PackageName } from "helpers/resolvePackageVersion"
import { addPackage } from "install-pnpm-package"

export const installPackage = async (
  config: Config,
  packageName: PackageName | PackageName[],
  options?: { prod?: boolean; peer?: boolean }
) => {
  const packages = Array.isArray(packageName) ? packageName : [packageName]
  const versionedPackageNames = packages.map(packageName => `${packageName}@${getPackageVersion(packageName)}`)
  await addPackage(versionedPackageNames, {
    directory: config.targetDir,
    type: options?.peer ? "peer" : options?.prod ? "normal" : "dev",
    packageManager: config.packageManager,
  })

  await addPackageJsonToGit(config)
}
