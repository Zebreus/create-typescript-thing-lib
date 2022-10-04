import { Config } from "helpers/generateConfig"
import { loadExistingFile } from "helpers/loadExistingFile"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { format, getFileInfo } from "prettier"

const addCorrectSuffix = (file: string) => {
  if (file.endsWith("pre-commit")) {
    return file + ".sh"
  }
  if (file.endsWith("flake.lock")) {
    return file + ".json"
  }
  return file
}

export const formatFileContent = async (content: string, file: string) => {
  const transformedFile = addCorrectSuffix(file)
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
  })
  return formattedContent
}

export const formatFile = async (config: Config, file: string) => {
  const content = await loadExistingFile(config, file).catch(() => undefined)
  if (!content) return

  const formattedContent = await formatFileContent(content, file)
  if (formattedContent === content) return

  await writeAndAddFile(config, file, formattedContent)
}
