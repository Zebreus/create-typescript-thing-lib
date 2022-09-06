import { addToIgnoreFile } from "helpers/addToIgnoreFile"
import { loadExistingFile } from "helpers/loadExistingFile"
import { writeAndAddFile } from "helpers/writeAndAddFile"

export const addToGitIgnore = async (targetDir: string, topic: string, entry: string | string[]) => {
  const gitIgnoreContent = (await loadExistingFile(targetDir, ".gitignore")) || ""
  const newGitIgnoreContent = await addToIgnoreFile(gitIgnoreContent, topic, entry)
  await writeAndAddFile(targetDir, ".gitignore", newGitIgnoreContent)
}
