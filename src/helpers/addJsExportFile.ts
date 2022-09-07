import { writeAndAddFile } from "helpers/writeAndAddFile"

export const addCommonJsExportFile = async (targetDir: string, file: string, content: unknown) => {
  const stringContent = generateCommonJsExportFile(content)
  await writeAndAddFile(targetDir, file, stringContent)
}

export const generateCommonJsExportFile = (content: unknown) => {
  return `module.exports = ${JSON.stringify(content, null, 2)}
`
}
