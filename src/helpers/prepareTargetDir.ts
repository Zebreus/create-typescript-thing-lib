import { access, mkdir, stat } from "fs/promises"

export const prepareTargetDir = async (targetDir: string) => {
  try {
    await access(targetDir)
  } catch (e) {
    await mkdir(targetDir, { recursive: true })
  }

  const targetDirStat = await stat(targetDir)
  if (!targetDirStat.isDirectory()) {
    throw new Error(`Target directory ${targetDir} is not a directory`)
  }

  const packageJsonAlreadyExists = await access(targetDir + "/package.json")
    .then(() => true)
    .catch(() => false)

  if (packageJsonAlreadyExists) {
    throw new Error(`Target directory ${targetDir} already contains a package.json`)
  }
}
