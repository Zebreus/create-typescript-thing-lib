import fs from "fs"
import { Config } from "helpers/generateConfig"
import { commit, statusMatrix } from "isomorphic-git"

export const commitWithAuthor = async (config: Config, message: string) => {
  if (!config.gitCommits) {
    return
  }
  if (config.update) {
    return
  }

  const changes = (
    await statusMatrix({
      fs,
      dir: config.targetDir,
    })
  ).filter(([, HEAD, WORKDIR, STAGE]) => !(HEAD == 1 && WORKDIR == 1 && STAGE == 1))
  // do not create empty commit
  if (changes.length === 0) {
    return
  }

  return await commit({
    fs,
    dir: config.targetDir,
    message: message,
    author: { name: "Zebreus", email: "zebreus@madmanfred.com" },
    committer: { name: "Zebreus", email: "zebreus@madmanfred.com" },
  })
}
