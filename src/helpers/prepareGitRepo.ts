import fs from "fs"
import { Config } from "helpers/generateConfig"
import {
  addRemote,
  checkout,
  currentBranch,
  deleteRemote,
  fetch,
  init,
  listBranches,
  listRemotes,
} from "isomorphic-git"
import http from "isomorphic-git/http/node"

export const prepareGitRepo = async (config: Config, origin: string | undefined, mainBranch: string) => {
  if (!config.gitRepo && !config.gitCommits) {
    return
  }

  await ensureGitRepo(config, origin, mainBranch)

  await checkExistingRepo(config, origin, mainBranch)
}

const ensureGitRepo = async (config: Config, origin: string | undefined, mainBranch: string) => {
  const repoExists = await currentBranch({ fs, dir: config.targetDir }).catch(() => undefined)

  if (!repoExists) {
    await createNewRepo(config, origin, mainBranch)
    return
  }
}

const checkExistingRepo = async (config: Config, origin: string | undefined, mainBranch: string) => {
  const actualBranch = await currentBranch({ fs, dir: config.targetDir })
  if (actualBranch !== mainBranch) {
    throw new Error(`Current branch is ${actualBranch}, but should be ${mainBranch}`)
  }
  const remotes = await listRemotes({ fs, dir: config.targetDir })
  if (remotes.length === 0) {
    if (!origin) {
      throw new Error("You need to specify an origin for the new git repo")
    }
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

const createNewRepo = async (config: Config, origin: string | undefined, mainBranch: string) => {
  config.logger.logState("gitcreate", { state: "active", text: "Initializing git repo" })
  await init({ fs, dir: config.targetDir, defaultBranch: mainBranch })

  if (!origin) {
    config.logger.logState("gitcreate", { state: "completed", text: "Initialized git repo" })
    return
  }

  const httpsGitOrigin = origin?.replace(/git@([^:]+):(.+)\.git/, "https://$1/$2")

  config.logger.logState("gitcreate", { state: "active", text: "Adding git origin" })
  await addRemote({ fs, dir: config.targetDir, remote: "origin", url: httpsGitOrigin })
  config.logger.logState("gitcreate", { state: "active", text: "Pulling repo" })
  try {
    await fetch({
      fs,
      dir: config.targetDir,
      http,
    })
  } catch (e) {
    throw new Error("Could not fetch from origin. Maybe the repo is empty or something?")
  }

  const remoteBranches = await listBranches({ fs, dir: config.targetDir, remote: "origin" })
  if (!remoteBranches.includes(mainBranch)) {
    const alternativeBranch = remoteBranches.filter(branch => branch.toLowerCase() !== "head")[0] as string | undefined
    config.logger.logState("gitcreate", { state: "failed", text: "Failed to initialize git repository" })
    throw new Error(
      `The remote repo doesn't have a branch called ${mainBranch}.${
        alternativeBranch ? ` Did you mean ${alternativeBranch}?` : ""
      }`
    )
  }

  await checkout({ fs, dir: config.targetDir, ref: mainBranch })

  // Restore to real non https remote
  await deleteRemote({ fs, dir: config.targetDir, remote: "origin" })
  await addRemote({ fs, dir: config.targetDir, remote: "origin", url: origin })

  config.logger.logState("gitcreate", { state: "completed", text: "Initialized git repo" })
}
