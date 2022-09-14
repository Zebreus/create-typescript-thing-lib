import { Options } from "index"
import { normalize, resolve } from "path"

/**
 * There are some values that are basically required everywhere. This object bundles them.
 *
 * I just want to keep things here that define the environment that is required for some functions, but not the parameters of the function.
 */
export type Config = {
  targetDir: string
}

export const generateConfig = async (config: Options): Promise<Config> => {
  const targetDir = normalize(resolve(process.cwd(), config.path || config.name || "."))
  return { targetDir }
}
