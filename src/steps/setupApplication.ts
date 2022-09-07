import { addScriptToPackage, appendScriptToPackage } from "helpers/addScriptToPackage"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { installPackage } from "helpers/installPackage"
import { modifyJsonConfig } from "helpers/modifyJsonFile"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { PackageManager } from "install-pnpm-package/dist/detectPackageManager"
import { PackageJson } from "types-package-json"

export const setupApplication = async (targetDir: string, packageManager: PackageManager, name: string) => {
  await installPackage(targetDir, packageManager, ["@vercel/ncc"])

  await modifyJsonConfig<Omit<PackageJson, "keywords"> & { keywords?: string[] }>(
    targetDir,
    "package.json",
    packageJson => ({
      ...packageJson,
      files: [...new Set([...(packageJson.files || []), "dist/**"])],
      keywords: [...new Set([...(packageJson.keywords || []), "cli", "application", "interactive"])],
      main: "dist/index.js",
      bin: {
        ...(packageJson.bin || {}),
        [name]: "dist/index.js",
      },
    })
  )

  await appendScriptToPackage(
    targetDir,
    "build",
    "ncc build --out dist --minify src/index.ts && sed '1s;^;#!/usr/bin/env node\\\\n;' dist/index.js -i && chmod a+x dist/index.js"
  )
  await appendScriptToPackage(
    targetDir,
    "prepack",
    "rm -rf dist && ncc build --out dist --minify src/index.ts && sed '1s;^;#!/usr/bin/env node\\\\n;' dist/index.js -i && chmod a+x dist/index.js"
  )
  await appendScriptToPackage(targetDir, "prepublish", "eslint --cache && tsc --noEmit")
  await addScriptToPackage(targetDir, "start", "ncc run src/index.ts")

  await writeAndAddFile(targetDir, "src/index.ts", generateApplicationIndex())

  await commitWithAuthor(targetDir, "Setup project as cli application")
}

const generateApplicationIndex = () => {
  return `console.log("You launched the application!")
  
  export {}`
}
