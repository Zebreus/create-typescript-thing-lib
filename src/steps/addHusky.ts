import { addPackageJsonToGit } from "helpers/addPackageJsonToGit"
import { addScriptToPackage } from "helpers/addScriptToPackage"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { installPackagePnpm } from "install-pnpm-package"

export const addHusky = async (targetDir: string) => {
  await installPackagePnpm(["husky", "pinst"], { directory: targetDir, type: "dev" })
  await addPackageJsonToGit(targetDir)

  await writeAndAddFile(
    targetDir,
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

  await writeAndAddFile(targetDir, ".prettierrc.json", JSON.stringify(prettierRcObject, null, 2))

  await addScriptToPackage(targetDir, "postinstall", "husky install")
  await addScriptToPackage(targetDir, "prepack", "pinst --disable")
  await addScriptToPackage(targetDir, "postpack", "pinst --enable")

  await commitWithAuthor(targetDir, "Install husky and enable pre-commmit hook")
}
