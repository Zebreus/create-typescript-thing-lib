import { addPackageJsonToGit } from "helpers/addPackageJsonToGit"
import { addPackage } from "install-pnpm-package"
import { PackageManager } from "install-pnpm-package/dist/detectPackageManager"

export const installPackage = async (
  targetDir: string,
  packageManager: PackageManager,
  packageName: string | string[],
  options?: { prod?: boolean }
) => {
  const packages = Array.isArray(packageName) ? packageName : [packageName]

  await addPackage(packages, {
    directory: targetDir,
    type: options?.prod ? "normal" : "dev",
    packageManager,
  })

  await addPackageJsonToGit(targetDir)
}
