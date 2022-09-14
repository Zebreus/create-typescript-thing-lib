import { addScriptToPackage } from "helpers/addScriptToPackage"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { PackageManager } from "install-pnpm-package/dist/detectPackageManager"

export const addHusky = async (config: Config, packageManager: PackageManager) => {
  await installPackage(config, packageManager, ["husky", "pinst"])

  await writeAndAddFile(
    config,
    ".husky/pre-commit",
    `#!/usr/bin/env sh
  . "$(dirname -- "$0")/_/husky.sh"
  
  FORCE_COLOR=1 yarn lint-staged -c .lintstagedrc.json`,
    { executable: true }
  )

  const prettierRcObject = {
    arrowParens: "avoid",
    bracketSpacing: true,
    embeddedLanguageFormatting: "auto",
    htmlWhitespaceSensitivity: "css",
    insertPragma: false,
    jsxBracketSameLine: false,
    jsxSingleQuote: false,
    printWidth: 120,
    proseWrap: "always",
    quoteProps: "consistent",
    requirePragma: false,
    semi: false,
    singleQuote: false,
    tabWidth: 2,
    trailingComma: "es5",
    useTabs: false,
    vueIndentScriptAndStyle: false,
    plugins: ["prettier-plugin-organize-imports"],
  }

  await writeAndAddFile(config, ".prettierrc.json", JSON.stringify(prettierRcObject, null, 2))

  await addScriptToPackage(config, "postinstall", "husky install")
  await addScriptToPackage(config, "prepack", "pinst --disable")
  await addScriptToPackage(config, "postpack", "pinst --enable")

  await commitWithAuthor(config, "Install husky and enable pre-commmit hook")
}
