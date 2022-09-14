import { addToIgnoreFile } from "helpers/addToIgnoreFile"
import { Config } from "helpers/generateConfig"
import { loadExistingFile } from "helpers/loadExistingFile"
import { writeAndAddFile } from "helpers/writeAndAddFile"

export const addToGitIgnore = async (config: Config, topic: string, entry: string | string[]) => {
  const gitIgnoreContent = (await loadExistingFile(config, ".gitignore")) || ""
  const newGitIgnoreContent = await addToIgnoreFile(gitIgnoreContent, topic, entry)
  await writeAndAddFile(config, ".gitignore", newGitIgnoreContent)
}
