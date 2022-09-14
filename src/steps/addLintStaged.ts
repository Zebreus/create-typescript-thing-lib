import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { writeAndAddFile } from "helpers/writeAndAddFile"

export const addLintStaged = async (config: Config) => {
  await installPackage(config, ["lint-staged", "tsc-files"])

  const lintStagedRcObject = {
    "*.+(ts|tsx)": ["prettier --write", "eslint --cache --fix", "tsc-files --noEmit"],
    "*.+(js|jsx)": ["prettier --write", "eslint --cache --fix"],
    "*.+(json|css|md|yml|yaml|scss)": ["prettier --write"],
  }

  await writeAndAddFile(config, ".lintstagedrc.json", JSON.stringify(lintStagedRcObject, null, 2))

  await commitWithAuthor(config, "Install lint-staged")
}
