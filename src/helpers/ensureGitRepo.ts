import fs from "fs"
import { addRemote, currentBranch, init, listRemotes } from "isomorphic-git"

export const ensureGitRepo = async (targetDir: string, origin: string, mainBranch: string) => {
  const repoExists = await currentBranch({ fs, dir: targetDir }).catch(() => undefined)
  if (repoExists) {
    await checkExistingRepo(targetDir, origin, mainBranch)
    return
  }

  await createNewRepo(targetDir, origin, mainBranch)
}

const checkExistingRepo = async (targetDir: string, origin: string, mainBranch: string) => {
  const actualBranch = await currentBranch({ fs, dir: targetDir })
  if (actualBranch !== mainBranch) {
    throw new Error(`Current branch is ${actualBranch}, but should be ${mainBranch}`)
  }
  const remotes = await listRemotes({ fs, dir: "." })
  if (remotes.length === 0) {
    await addRemote({ fs, dir: targetDir, remote: "origin", url: origin })
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

const createNewRepo = async (targetDir: string, origin: string, mainBranch: string) => {
  await init({ fs, dir: targetDir, defaultBranch: mainBranch })
  await addRemote({ fs, dir: targetDir, remote: "origin", url: origin })
}
