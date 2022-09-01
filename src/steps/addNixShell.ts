import fs from "fs"
import { loadResource } from "helpers/loadResource"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { commit } from "isomorphic-git"

export const addNixShell = async (targetDir: string) => {
  const shellNixContent = await loadResource("shell.nix")
  await writeAndAddFile(targetDir, "shell.nix", shellNixContent)
  commit({ fs, dir: targetDir, message: "Add nix shell" })
}
