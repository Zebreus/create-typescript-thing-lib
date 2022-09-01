import { readFile } from "fs/promises"
import path from "path"

export const loadResource = async (name: string) => {
  const buffer = await readFile(path.join(__dirname, "../../resources", name))
  return buffer.toString()
}
