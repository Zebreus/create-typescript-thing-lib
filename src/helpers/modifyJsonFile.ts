import { loadExistingFile } from "helpers/loadExistingFile"
import { writeAndAddFile } from "helpers/writeAndAddFile"

export const modifyJsonConfig = async <T>(targetDir: string, file: string, modify: (source: T) => Promise<T> | T) => {
  const sourceFile = await loadExistingFile(targetDir, file)
  if (!sourceFile) {
    throw new Error(`File ${file} not found`)
  }
  const sourceObject = JSON.parse(sourceFile)
  if (typeof sourceObject !== "object" || sourceObject === null) {
    throw new Error(`File ${file} does not contain a JSON object`)
  }
  const modified = await modify(sourceObject)
  await writeAndAddFile(targetDir, file, JSON.stringify(modified, null, 2))
}
