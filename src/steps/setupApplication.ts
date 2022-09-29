import { addScriptToPackage, appendScriptToPackage } from "helpers/addScriptToPackage"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { modifyJsonConfig } from "helpers/modifyJsonFile"
import { withStateLogger } from "helpers/withStateLogger"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { PackageJson } from "types-package-json"

export const setupApplication = withStateLogger(
  {
    id: "application",
    message: "Configuring project as a cli application",
    failed: "Failed to configure cli application",
    completed: "Configured project as a cli application",
  },
  async (config: Config) => {
    await installPackage(config, ["@zebreus/resolve-tspaths@0.8.9"])

    await modifyJsonConfig<Omit<PackageJson, "keywords"> & { keywords?: string[] }>(
      config,
      "package.json",
      packageJson => ({
        ...packageJson,
        files: [...new Set([...(packageJson.files || []), "dist/**"])],
        keywords: [...new Set([...(packageJson.keywords || []), "cli", "application", "interactive"])],
        main: "dist/index.js",
        bin: {
          ...(packageJson.bin || {}),
          [packageJson.name]: "dist/index.js",
        },
      })
    )

    await appendScriptToPackage(
      config,
      "build",
      "rm -rf dist && tsc -p tsconfig.build.json && resolve-tspaths -p tsconfig.build.json && sed '1s;^;#!/usr/bin/env node\\\\n;' dist/index.js -i && chmod a+x dist/index.js"
    )
    await appendScriptToPackage(
      config,
      "prepack",
      "rm -rf dist && tsc -p tsconfig.build.json && resolve-tspaths -p tsconfig.build.json && sed '1s;^;#!/usr/bin/env node\\\\n;' dist/index.js -i && chmod a+x dist/index.js"
    )
    await appendScriptToPackage(config, "prepublish", "eslint --cache && tsc --noEmit")
    await addScriptToPackage(
      config,
      "start",
      "node --loader ts-node/esm --loader @zebreus/resolve-tspaths/esm 'index.js'"
    )

    await writeAndAddFile(config, "src/index.ts", generateApplicationIndex())

    await commitWithAuthor(config, "Setup project as cli application")
  }
)
const generateApplicationIndex = () => {
  return `console.log("You launched the application!")
  
  export {}`
}
