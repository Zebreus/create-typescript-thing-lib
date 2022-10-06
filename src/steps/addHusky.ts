import { appendScriptToPackage } from "helpers/addScriptToPackage"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { withStateLogger } from "helpers/withStateLogger"
import { writeAndAddFile } from "helpers/writeAndAddFile"

export const addHusky = withStateLogger(
  { id: "husky", completed: "Added git hooks with husky" },
  async (config: Config) => {
    await installPackage(config, ["husky", "pinst"])

    await writeAndAddFile(
      config,
      ".husky/pre-commit",
      `#!/usr/bin/env sh
  . "$(dirname -- "$0")/_/husky.sh"
  
  FORCE_COLOR=1 "$(dirname -- "$0")/../node_modules/.bin/lint-staged" -c .lintstagedrc.json`,
      { executable: true }
    )

    await appendScriptToPackage(config, "postinstall", "husky install")
    await appendScriptToPackage(config, "prepack", "pinst --disable")
    await appendScriptToPackage(config, "postpack", "pinst --enable")

    await commitWithAuthor(config, "Install husky and enable pre-commmit hook")
  }
)
