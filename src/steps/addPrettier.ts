import { addScriptToPackage, appendScriptToPackage } from "helpers/addScriptToPackage"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { augmentJsonConfig } from "helpers/modifyJsonFile"
import { withStateLogger } from "helpers/withStateLogger"

export const addPrettier = withStateLogger({ id: "prettier" }, async (config: Config) => {
  await installPackage(config, ["prettier", "prettier-plugin-organize-imports"])

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

  await augmentJsonConfig(config, ".prettierrc.json", prettierRcObject)

  await addScriptToPackage(config, "format", "prettier --write .")

  await appendScriptToPackage(config, "lint", "prettier . --check")

  await commitWithAuthor(config, "Install prettier")
})
