import { Eslintrc } from "eslintrc-type"
import { addScriptToPackage } from "helpers/addScriptToPackage"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { modifyJsonConfig as modifyJsonFile } from "helpers/modifyJsonFile"
import { withStateLogger } from "helpers/withStateLogger"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { Tsconfig } from "tsconfig-type"

export const addJest = withStateLogger({ id: "jest" }, async (config: Config) => {
  await installPackage(config, [
    "jest@29.0.3",
    "@types/jest@29.0.3",
    "ts-jest@29.0.1",
    "ts-node@10.9.1",
    "eslint-plugin-jest@27.0.4",
    "@zebreus/resolve-tspaths@0.8.6",
  ])

  await writeAndAddFile(config, "jest.config.js", generateJestConfig())

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

const generateJestConfig = () => {
  return `import { resolveTsModuleNames } from "@zebreus/resolve-tspaths/jest"

const config = {
  roots: ["<rootDir>/src"],
  moduleDirectories: ["node_modules", "src"],
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: resolveTsModuleNames("tsconfig.build.json"),
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  coverageThreshold: {
    global: {
      statements: 95,
    },
  },
}

export default config`
}
