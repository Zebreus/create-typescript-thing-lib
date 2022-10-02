import { Eslintrc } from "eslintrc-type"
import { addScriptToPackage } from "helpers/addScriptToPackage"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { augmentJsonConfig } from "helpers/modifyJsonFile"
import { withStateLogger } from "helpers/withStateLogger"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { Tsconfig } from "tsconfig-type"

export const addJest = withStateLogger({ id: "jest" }, async (config: Config) => {
  await installPackage(config, [
    "jest",
    "@types/jest",
    "ts-jest",
    "ts-node",
    "eslint-plugin-jest",
    "@zebreus/resolve-tspaths",
  ])

  const jestConfig = {
    extensionsToTreatAsEsm: [".ts"],
    transform: {
      "^.+.m?tsx?$": "@zebreus/resolve-tspaths/jest",
    },
    coverageThreshold: {
      global: {
        statements: 95,
      },
    },
  }

  await augmentJsonConfig(config, "jest.config.json", jestConfig)

  await writeAndAddFile(config, "src/tests/example.test.ts", generateExampleTest())

  await augmentJsonConfig<Tsconfig>(config, "tsconfig.build.json", {
    exclude: ["src/tests", "src/**/*.test.ts"],
  })

  await augmentJsonConfig<
    Eslintrc & {
      rules?: Record<string, unknown>
    }
  >(config, ".eslintrc.json", {
    extends: ["plugin:jest/recommended"],
    rules: {
      "jest/expect-expect": "off",
    },
  })

  await addScriptToPackage(config, "test", "NODE_OPTIONS='--experimental-vm-modules' jest")

  await commitWithAuthor(config, "Install jest")
})

const generateExampleTest = () => {
  return `describe("some examples work", () => {
        test("one is one", async () => {
          expect(1).toEqual(1)
        })
      
        test("two is two", async () => {
          expect(2).toEqual(2)
        })
      
        test("throw throws", async () => {
          expect(() => {
            throw new Error("eyyy")
          }).toThrow()
        })
      })
      
      // eslint-disable-next-line jest/no-export
      export {}
    `
}
