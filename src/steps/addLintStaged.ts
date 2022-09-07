import { addPackageJsonToGit } from "helpers/addPackageJsonToGit"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { installPackagePnpm } from "install-pnpm-package"

export const addLintStaged = async (targetDir: string) => {
  await installPackagePnpm(["lint-staged", "tsc-files"], { directory: targetDir, type: "dev" })
  await addPackageJsonToGit(targetDir)

  const lintStagedRcObject = {
    "*.+(ts|tsx)": ["prettier --write", "eslint --cache --fix", "tsc-files --noEmit"],
    "*.+(js|jsx)": ["prettier --write", "eslint --cache --fix"],
    "*.+(json|css|md|yml|yaml|scss)": ["prettier --write"],
  }

  await writeAndAddFile(targetDir, ".lintstagedrc.json", JSON.stringify(lintStagedRcObject, null, 2))

  await commitWithAuthor(targetDir, "Install lint-staged")
}
