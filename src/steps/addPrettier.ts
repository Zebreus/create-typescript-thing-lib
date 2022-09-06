import { addPackageJsonToGit } from "helpers/addPackageJsonToGit"
import { addScriptToPackage } from "helpers/addScriptToPackage"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { installPackagePnpm } from "install-pnpm-package"

export const addPrettier = async (targetDir: string) => {
  await installPackagePnpm(["prettier", "prettier-plugin-organize-imports"], { directory: targetDir, type: "dev" })
  await addPackageJsonToGit(targetDir)

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

  await writeAndAddFile(targetDir, ".prettierrc.json", JSON.stringify(prettierRcObject, null, 2))

  await addScriptToPackage(targetDir, "format", "prettier --write .")

  await commitWithAuthor(targetDir, "Install prettier")
}
