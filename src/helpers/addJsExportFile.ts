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

export const addESMExportFile = async (config: Config, file: string, content: unknown) => {
  const stringContent = generateESMExportFile(content)
  await writeAndAddFile(config, file, stringContent)
}

export const generateESMExportFile = (content: unknown) => {
  return `const config = ${JSON.stringify(content, null, 2)}

export default config`
}
