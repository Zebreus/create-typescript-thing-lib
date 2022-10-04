import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"

export const commitUpdate = async (config: Config) => {
  if (!config.update) {
    return
  }
  await commitWithAuthor({ ...config, update: false }, "Update project")
}
