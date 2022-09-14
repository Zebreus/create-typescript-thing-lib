import { Config } from "helpers/generateConfig"
import { writeAndAddFile } from "helpers/writeAndAddFile"

export const addCommonJsExportFile = async (config: Config, file: string, content: unknown) => {
  const stringContent = generateCommonJsExportFile(content)
  await writeAndAddFile(config, file, stringContent)
}

export const generateCommonJsExportFile = (content: unknown) => {
  return `module.exports = ${JSON.stringify(content, null, 2)}
`
}
