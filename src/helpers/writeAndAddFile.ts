import fs from "fs"
import { access, chmod, mkdir, writeFile } from "fs/promises"
import { add } from "isomorphic-git"
import { dirname, relative, resolve } from "path"

export const writeAndAddFile = async (
  targetDir: string,
  file: string,
  content: string,
  options?: { executable?: boolean }
) => {
  const targetFile = resolve(targetDir, file)
  const dir = dirname(targetFile)
  const dirExists = await access(dir)
    .then(() => true)
    .catch(() => false)
  if (!dirExists) {
    await mkdir(dir, { recursive: true })
  }

  await writeFile(targetFile, content)

  if (options?.executable) {
    await chmod(targetFile, 0o755)
  }

  await add({ fs, dir: targetDir, filepath: relative(targetDir, targetFile) })
}
