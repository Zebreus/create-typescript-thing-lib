import { Eslintrc } from "eslintrc-type"
import { addCommonJsExportFile } from "helpers/addJsExportFile"
import { addPackageJsonToGit } from "helpers/addPackageJsonToGit"
import { addScriptToPackage } from "helpers/addScriptToPackage"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { modifyJsonConfig as modifyJsonFile } from "helpers/modifyJsonFile"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { installPackagePnpm } from "install-pnpm-package"
import { Tsconfig } from "tsconfig-type"

export const addJest = async (targetDir: string) => {
  await installPackagePnpm(["jest", "@types/jest", "ts-jest", "ts-node", "eslint-plugin-jest"], {
    directory: targetDir,
    type: "dev",
  })
  await addPackageJsonToGit(targetDir)

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

  await addCommonJsExportFile(targetDir, "jest.config.js", jestConfigObject)

  await writeAndAddFile(targetDir, "src/tests/example.test.ts", generateExampleTest())

  await modifyJsonFile<Tsconfig>(targetDir, "tsconfig.json", tsConfig => ({
    ...tsConfig,
    exclude: [...new Set([...(tsConfig.exclude || []), "src/tests", "src/**/*.test.ts"])],
  }))

  await modifyJsonFile<Eslintrc>(targetDir, ".eslintrc.json", eslintRc => ({
    ...eslintRc,
    extends: [...new Set([...(eslintRc.extends || []), "plugin:jest/recommended"])],
    rules: {
      ...(eslintRc.rules || {}),
      "jest/expect-expect": "off",
    },
  }))

  await addScriptToPackage(targetDir, "test", "jest")

  await commitWithAuthor(targetDir, "Install jest")
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
      
      export {}
    `
}
