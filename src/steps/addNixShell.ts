import { commitWithAuthor } from "helpers/commitWithAuthor"
import { loadResource } from "helpers/loadResource"
import { writeAndAddFile } from "helpers/writeAndAddFile"

export const addNixShell = async (targetDir: string) => {
  const shellNixContent = await loadResource("shell.nix")
  await writeAndAddFile(targetDir, "shell.nix", shellNixContent)
  await commitWithAuthor(targetDir, "Add nix shell")
}
