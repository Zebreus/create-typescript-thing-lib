export type Options = {
  path?: string
  name?: string
  description?: string
  type?: "library" | "application"
  monorepo?: boolean
  repo?: string
  branch?: string
  authorName?: string
  authorEmail?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createTypescriptThing = async (settings: Options) => {}

export default createTypescriptThing
