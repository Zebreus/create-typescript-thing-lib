import fs from "fs"
import { access, chmod, mkdir, writeFile } from "fs/promises"
import { formatFileContent } from "helpers/formatFileContent"
import { Config } from "helpers/generateConfig"
import { add } from "isomorphic-git"
import { dirname, relative, resolve } from "path"

export const writeAndAddFile = async (
  config: Config,
  file: string,
  content: string,
  options?: { executable?: boolean }
) => {
  const targetFile = resolve(config.targetDir, file)
  const dir = dirname(targetFile)
  const dirExists = await access(dir)
    .then(() => true)
    .catch(() => false)
  if (!dirExists) {
    await mkdir(dir, { recursive: true })
  }

  const formattedContent = await formatFileContent(content, file)

  await writeFile(targetFile, formattedContent)

  if (options?.executable) {
    await chmod(targetFile, 0o755)
  }

  if (config.gitCommits) {
    await add({ fs, dir: config.targetDir, filepath: relative(config.targetDir, targetFile) })
  }
}
