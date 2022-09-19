import { format, getFileInfo } from "prettier"

export const formatFileContent = async (content: string, file: string) => {
  const transformedFile = file.endsWith("pre-commit") ? file + ".sh" : file
  const fileInfo = await getFileInfo(transformedFile)
  if (!fileInfo.inferredParser) {
    return content
  }
  const formattedContent = format(content, {
    filepath: transformedFile,
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
  })
  return formattedContent
}
