import { addScriptToPackage } from "helpers/addScriptToPackage"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { PackageManager } from "install-pnpm-package/dist/detectPackageManager"

export const addPrettier = async (config: Config, packageManager: PackageManager) => {
  await installPackage(config, packageManager, ["prettier", "prettier-plugin-organize-imports"])

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

  await addScriptToPackage(config, "format", "prettier --write .")

  await commitWithAuthor(config, "Install prettier")
}
