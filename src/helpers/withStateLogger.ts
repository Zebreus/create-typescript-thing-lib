import { Config } from "helpers/generateConfig"

export const withStateLogger = <T extends Array<unknown>, U>(
  options: { id: string; message?: string; completed?: string; failed?: string },
  fn: (config: Config, ...args: T) => Promise<U>
) => {
  const message = options.message || `Installing ${options.id}`
  const completed = options.completed || `Installed ${options.id}`
  const failed = options.failed || `Failed to install ${options.id}`

  return async (config: Config, ...args: T) => {
    config.logger.logState(options.id, { text: message, state: "active" })
    try {
      const result = await fn(config, ...args)
      config.logger.logState(options.id, { text: completed, state: "completed" })
      return result
    } catch (e) {
      config.logger.logState(options.id, { text: failed, state: "failed" })
      throw e
    }
  }
}
