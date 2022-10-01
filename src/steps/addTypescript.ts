import { appendScriptToPackage } from "helpers/addScriptToPackage"
import { addToGitIgnore } from "helpers/addToGitIgnore"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { withStateLogger } from "helpers/withStateLogger"
import { writeAndAddFile } from "helpers/writeAndAddFile"

export const addTypescript = withStateLogger({ id: "TypeScript" }, async (config: Config) => {
  await installPackage(config, ["typescript@4.8.3", "@types/node@18.7.18"])

  const tsConfigObject = {
    compilerOptions: {
      target: "ES2020",
      lib: ["ES2020"],
      module: "ES2020",
      moduleResolution: "node",
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      outDir: "dist",
      noEmit: true,
      isolatedModules: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      strict: true,
      skipLibCheck: true,
      allowUnusedLabels: false,
      allowUnreachableCode: false,
      exactOptionalPropertyTypes: true,
      noFallthroughCasesInSwitch: true,
      noPropertyAccessFromIndexSignature: true,
      noUncheckedIndexedAccess: true,
      resolveJsonModule: true,
      rootDir: "src",
      baseUrl: ".",
      paths: {
        "*": ["./src/*"],
      },
    },
    include: ["src/**/*"],
    exclude: ["node_modules"],
  }
  await writeAndAddFile(config, "tsconfig.json", JSON.stringify(tsConfigObject, null, 2))

  const tsConfigBuildObject = {
    extends: "./tsconfig.json",
    compilerOptions: {
      noEmit: false,
      sourceMap: false,
      declarationMap: false,
    },
  }
  await writeAndAddFile(config, "tsconfig.build.json", JSON.stringify(tsConfigBuildObject, null, 2))

  await appendScriptToPackage(config, "lint", "tsc --noEmit")
  await appendScriptToPackage(
    config,
    "build",
    "rm -rf dist && tsc -p tsconfig.build.json && resolve-tspaths -p tsconfig.build.json"
  )
  await appendScriptToPackage(
    config,
    "prepack",
    "rm -rf dist && tsc -p tsconfig.build.json && resolve-tspaths -p tsconfig.build.json"
  )

  await addToGitIgnore(config, "typescript", ["*.tsbuildinfo", "dist/"])

  await commitWithAuthor(config, "Install typescript")
})
