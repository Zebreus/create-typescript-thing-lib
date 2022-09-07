import { addPackageJsonToGit } from "helpers/addPackageJsonToGit"
import { appendScriptToPackage } from "helpers/addScriptToPackage"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { modifyJsonConfig } from "helpers/modifyJsonFile"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { installPackagePnpm } from "install-pnpm-package"
import { PackageJson } from "types-package-json"

export const setupLibrary = async (targetDir: string) => {
  await installPackagePnpm(["resolve-tspaths"], { directory: targetDir, type: "dev" })
  await addPackageJsonToGit(targetDir)

  await modifyJsonConfig<Omit<PackageJson, "keywords"> & { keywords?: string[] }>(
    targetDir,
    "package.json",
    packageJson => ({
      ...packageJson,
      files: [...new Set([...(packageJson.files || []), "dist"])],
      keywords: [...new Set([...(packageJson.keywords || []), "library"])],
      main: "dist/index.js",
    })
  )

  await appendScriptToPackage(
    targetDir,
    "build",
    "tsc --project tsconfig.build.json && resolve-tspaths -p tsconfig.build.json"
  )
  await appendScriptToPackage(
    targetDir,
    "prepack",
    "rm -rf dist && tsc --project tsconfig.build.json && resolve-tspaths -p tsconfig.build.json"
  )
  await appendScriptToPackage(targetDir, "prepublish", "eslint --cache && tsc --noEmit")

  await writeAndAddFile(targetDir, "src/index.ts", generateLibraryIndex())

  await commitWithAuthor(targetDir, "Setup project as library")
}

const generateLibraryIndex = () => {
  return `export const add = (a: number, b: number) => a + b
    export const subtract = (a: number, b: number) => a - b
    `
}
