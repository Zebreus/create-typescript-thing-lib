import fs from "fs"
import { Config } from "helpers/generateConfig"
import { commit } from "isomorphic-git"

export const commitWithAuthor = async (config: Config, message: string) => {
  if (!config.gitCommits) {
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
