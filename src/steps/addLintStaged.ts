import { commitWithAuthor } from "helpers/commitWithAuthor"
import { installPackage } from "helpers/installPackage"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { PackageManager } from "install-pnpm-package/dist/detectPackageManager"

export const addLintStaged = async (targetDir: string, packageManager: PackageManager) => {
  await installPackage(targetDir, packageManager, ["lint-staged", "tsc-files"])

  const lintStagedRcObject = {
    "*.+(ts|tsx)": ["prettier --write", "eslint --cache --fix", "tsc-files --noEmit"],
    "*.+(js|jsx)": ["prettier --write", "eslint --cache --fix"],
    "*.+(json|css|md|yml|yaml|scss)": ["prettier --write"],
  }

  await writeAndAddFile(targetDir, ".lintstagedrc.json", JSON.stringify(lintStagedRcObject, null, 2))

  await commitWithAuthor(targetDir, "Install lint-staged")
}
