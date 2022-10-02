import { Config } from "helpers/generateConfig"
import { loadExistingFile } from "helpers/loadExistingFile"
import { writeAndAddFile } from "helpers/writeAndAddFile"

/** Write a new json config / overwrite an existing one. The new config can be a function processing the previous one*/
export const createJsonConfig = async <T extends object | string | number>(
  config: Config,
  file: string,
  newConfig: T | ((oldConfig: T | undefined) => T | Promise<T>)
) => {
  const sourceFile = await loadExistingFile(config, file)
  const sourceObject = sourceFile && JSON.parse(sourceFile)
  const modified = typeof newConfig === "function" ? await newConfig(sourceObject as T | undefined) : newConfig
  await writeAndAddFile(config, file, JSON.stringify(modified, null, 2))
}

/** Specify a second jsonfile that gets deepmerged into the file */
export const augmentJsonConfig = async <T extends object | string | number>(
  config: Config,
  file: string,
  newConfig: T | ((oldConfig: T) => T)
) => {
  return createJsonConfig(config, file, oldConfig =>
    mergeJsonObjects(oldConfig, typeof newConfig === "function" ? newConfig(oldConfig as T) : newConfig)
  )
}

/** Deepmerge two json objects. To delete a key specify `undefined`. Arrays get joined and deduplicated */
const mergeJsonObjects = <T>(old: unknown, changes: T): unknown => {
  if (Array.isArray(old) && Array.isArray(changes)) {
    return [...new Set([...old, ...changes])]
  }
  if (typeof old === "object" && typeof changes === "object" && old !== null && changes !== null) {
    const oldRecord = old as Record<string, unknown>
    const changesRecord = changes as Record<string, unknown>

    const keys = [...Object.keys(oldRecord), ...Object.keys(changesRecord)]
    const newEntries = keys.map(
      key =>
        [
          key,
          Object.hasOwn(changesRecord, key) ? mergeJsonObjects(oldRecord[key], changesRecord[key]) : oldRecord[key],
        ] as const
    )
    return Object.fromEntries(newEntries)
  }
  return changes
}
