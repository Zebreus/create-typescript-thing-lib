import { appendScriptToPackage } from "helpers/addScriptToPackage"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { modifyJsonConfig } from "helpers/modifyJsonFile"
import { withStateLogger } from "helpers/withStateLogger"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { PackageJson } from "types-package-json"

export const setupLibrary = withStateLogger(
  {
    id: "library",
    message: "Configuring project as library",
    failed: "Failed to configure library",
    completed: "Configured project as library",
  },
  async (config: Config) => {
    await installPackage(config, ["@zebreus/resolve-tspaths@0.8.10"])

    await modifyJsonConfig<Omit<PackageJson, "keywords"> & { keywords?: string[] }>(
      config,
      "package.json",
      packageJson => ({
        ...packageJson,
        files: [...new Set([...(packageJson.files || []), "dist/**"])],
        keywords: [...new Set([...(packageJson.keywords || []), "library"])],
        main: "dist/index.js",
      })
    )

    await appendScriptToPackage(config, "prepublish", "eslint --cache && tsc --noEmit")

    await writeAndAddFile(config, "src/index.ts", generateLibraryIndex())

    await writeAndAddFile(config, "src/tests/example.test.ts", generateLibraryTest())

    await commitWithAuthor(config, "Setup project as library")
  }
)

const generateLibraryTest = () => {
  return `import { add, subtract } from "index"

it("adds two numbers", () => {
  expect(add(1, 2)).toBe(3)
})

it("subtracts two numbers", () => {
  expect(subtract(1, 2)).toBe(-1)
})`
}

const generateLibraryIndex = () => {
  return `export const add = (a: number, b: number) => a + b
    export const subtract = (a: number, b: number) => a - b
    `
}
