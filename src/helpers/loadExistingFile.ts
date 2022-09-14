import { readFile } from "fs/promises"
import { Config } from "helpers/generateConfig"
import path from "path"

export const loadExistingFile = async (config: Config, fileName: string) => {
  try {
    const buffer = await readFile(path.join(config.targetDir, fileName))
    return buffer.toString()
  } catch (e) {
    return undefined
  }
}
