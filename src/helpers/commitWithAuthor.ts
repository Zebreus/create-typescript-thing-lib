import fs from "fs"
import { commit } from "isomorphic-git"

export const commitWithAuthor = async (targetDir: string, message: string) => {
  return await commit({
    fs,
    dir: targetDir,
    message: message,
    author: { name: "Zebreus", email: "lennart@madmanfred.com" },
    committer: { name: "Zebreus", email: "lennart@madmanfred.com" },
  })
}
