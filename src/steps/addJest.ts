import { Eslintrc } from "eslintrc-type"
import { addCommonJsExportFile } from "helpers/addJsExportFile"
import { addScriptToPackage } from "helpers/addScriptToPackage"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { modifyJsonConfig as modifyJsonFile } from "helpers/modifyJsonFile"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { Tsconfig } from "tsconfig-type"

export const addJest = async (config: Config) => {
  await installPackage(config, ["jest", "@types/jest", "ts-jest", "ts-node", "eslint-plugin-jest"])

  const jestConfigObject = {
    roots: ["<rootDir>/src"],
    moduleDirectories: ["node_modules", "src"],
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
    coverageThreshold: {
      global: {
        statements: 95,
      },
    },
  }

  await addCommonJsExportFile(config, "jest.config.js", jestConfigObject)

  await writeAndAddFile(config, "src/tests/example.test.ts", generateExampleTest())

  await modifyJsonFile<Tsconfig>(config, "tsconfig.build.json", tsConfig => ({
    ...tsConfig,
    exclude: [...new Set([...(tsConfig.exclude || []), "src/tests", "src/**/*.test.ts"])],
  }))

  await modifyJsonFile<Eslintrc>(config, ".eslintrc.json", eslintRc => ({
    ...eslintRc,
    extends: [...new Set([...(eslintRc.extends || []), "plugin:jest/recommended"])],
    rules: {
      ...(eslintRc.rules || {}),
      "jest/expect-expect": "off",
    },
  }))

  await addScriptToPackage(config, "test", "jest")

  await commitWithAuthor(config, "Install jest")
}

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
