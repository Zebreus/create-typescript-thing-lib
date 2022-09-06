import { readFile } from "fs/promises"
import path from "path"

export const loadExistingFile = async (targetDir: string, fileName: string) => {
  try {
    const buffer = await readFile(path.join(targetDir, fileName))
    return buffer.toString()
  } catch (e) {
    return undefined
  }
}
