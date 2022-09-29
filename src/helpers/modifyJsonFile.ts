import { Config } from "helpers/generateConfig"
import { loadExistingFile } from "helpers/loadExistingFile"
import { writeAndAddFile } from "helpers/writeAndAddFile"

export const modifyJsonConfig = async <T>(config: Config, file: string, modify: (source: T) => Promise<T> | T) => {
  const sourceFile = await loadExistingFile(config, file)
  if (!sourceFile) {
    throw new Error(`File ${file} not found`)
  }
  const sourceObject = JSON.parse(sourceFile)
  if (typeof sourceObject !== "object" || sourceObject === null) {
    throw new Error(`File ${file} does not contain a JSON object`)
  }
  const modified = await modify(sourceObject)
  await writeAndAddFile(config, file, JSON.stringify(modified, null, 2))
}

export const writeAndAddJsonConfig = async (config: Config, file: string, content: unknown) => {
  await writeAndAddFile(config, file, JSON.stringify(content, null, 2))
}
