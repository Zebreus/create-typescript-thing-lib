import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { augmentJsonConfig } from "helpers/modifyJsonFile"
import { withStateLogger } from "helpers/withStateLogger"

export const addLintStaged = withStateLogger(
  { id: "lint staged", message: "Setting up linting for staged files" },
  async (config: Config) => {
    await installPackage(config, ["lint-staged@13.0.3", "tsc-files@1.1.3"])

    const lintStagedRcObject = {
      "*.+(ts|tsx)": ["prettier --write", "eslint --cache --fix", "tsc-files --noEmit"],
      "*.+(js|jsx)": ["prettier --write", "eslint --cache --fix"],
      "*.+(json|css|md|yml|yaml|scss)": ["prettier --write"],
    }

    await augmentJsonConfig(config, ".lintstagedrc.json", lintStagedRcObject)

    await commitWithAuthor(config, "Install lint-staged")
  }
)
