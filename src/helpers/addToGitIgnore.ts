import { addToIgnoreFile } from "helpers/addToIgnoreFile"
import { Config } from "helpers/generateConfig"
import { loadExistingFile } from "helpers/loadExistingFile"
import { writeAndAddFile } from "helpers/writeAndAddFile"

export const addToGitIgnore = async (config: Config, topic: string, entry: string | string[]) => {
  await appendToIgnoreFile(config, ".gitignore", topic, entry)
  await appendToIgnoreFile(config, ".prettierignore", topic, entry)
}

export const appendToIgnoreFile = async (config: Config, file: string, topic: string, entry: string | string[]) => {
  const ignoreFileContent = (await loadExistingFile(config, file)) || ""
  const newIgnoreFileContent = await addToIgnoreFile(ignoreFileContent, topic, entry)
  await writeAndAddFile(config, file, newIgnoreFileContent)
}
