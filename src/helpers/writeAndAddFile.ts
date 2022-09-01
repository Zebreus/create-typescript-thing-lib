import fs from "fs"
import { access, mkdir, writeFile } from "fs/promises"
import { add } from "isomorphic-git"
import { dirname, relative, resolve } from "path"

export const writeAndAddFile = async (targetDir: string, file: string, content: string) => {
  const targetFile = resolve(targetDir, file)
  const dir = dirname(targetFile)
  const dirExists = await access(dir)
    .then(() => true)
    .catch(() => false)
  if (!dirExists) {
    await mkdir(dir, { recursive: true })
  }

  await writeFile(targetFile, content)
  await add({ fs, dir: targetDir, filepath: relative(targetDir, targetFile) })
}
