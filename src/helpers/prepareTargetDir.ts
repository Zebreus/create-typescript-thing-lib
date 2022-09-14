import { access, mkdir, stat } from "fs/promises"
import { Config } from "helpers/generateConfig"

export const prepareTargetDir = async (config: Config) => {
  try {
    await access(config.targetDir)
  } catch (e) {
    config.logger.logMessage("Creating target directory", { type: "info" })
    await mkdir(config.targetDir, { recursive: true })
  }

  const targetDirStat = await stat(config.targetDir)
  if (!targetDirStat.isDirectory()) {
    throw new Error(`Target directory ${config.targetDir} is not a directory`)
  }

  const packageJsonAlreadyExists = await access(config.targetDir + "/package.json")
    .then(() => true)
    .catch(() => false)

  if (packageJsonAlreadyExists) {
    throw new Error(`Target directory ${config.targetDir} already contains a package.json`)
  }
}
