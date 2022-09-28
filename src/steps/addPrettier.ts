import { addScriptToPackage } from "helpers/addScriptToPackage"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { withStateLogger } from "helpers/withStateLogger"
import { writeAndAddFile } from "helpers/writeAndAddFile"

export const addPrettier = withStateLogger({ id: "prettier" }, async (config: Config) => {
  await installPackage(config, ["prettier@2.7.1", "prettier-plugin-organize-imports@3.1.1"])

  const prettierRcObject = {
    arrowParens: "avoid",
    bracketSpacing: true,
    embeddedLanguageFormatting: "auto",
    htmlWhitespaceSensitivity: "css",
    insertPragma: false,
    bracketSameLine: false,
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
})
