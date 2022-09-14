import fs from "fs"
import { Config } from "helpers/generateConfig"
import { addRemote, currentBranch, init, listRemotes } from "isomorphic-git"

export const ensureGitRepo = async (config: Config, origin: string, mainBranch: string) => {
  const repoExists = await currentBranch({ fs, dir: config.targetDir }).catch(() => undefined)
  if (repoExists) {
    await checkExistingRepo(config, origin, mainBranch)
    return
  }

  await createNewRepo(config, origin, mainBranch)
}

const checkExistingRepo = async (config: Config, origin: string, mainBranch: string) => {
  const actualBranch = await currentBranch({ fs, dir: config.targetDir })
  if (actualBranch !== mainBranch) {
    throw new Error(`Current branch is ${actualBranch}, but should be ${mainBranch}`)
  }
  const remotes = await listRemotes({ fs, dir: "." })
  if (remotes.length === 0) {
    await addRemote({ fs, dir: config.targetDir, remote: "origin", url: origin })
    return
  }
  const originRemote = remotes.find(remote => remote.remote === "origin")
  if (!originRemote) {
    throw new Error(
      "Your git remote needs to be called origin for now. Open an issue if you need this to be configurable."
    )
  }
  if (originRemote.url !== origin) {
    throw new Error(
      `The remote of the existing git repo is different to the new one. Existing: ${originRemote.url}, New: ${origin}`
    )
  }
  return
}

const createNewRepo = async (config: Config, origin: string, mainBranch: string) => {
  await init({ fs, dir: config.targetDir, defaultBranch: mainBranch })
  await addRemote({ fs, dir: config.targetDir, remote: "origin", url: origin })
}
