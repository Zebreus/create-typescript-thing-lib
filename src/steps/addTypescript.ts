import { appendScriptToPackage } from "helpers/addScriptToPackage"
import { addToGitIgnore } from "helpers/addToGitIgnore"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { augmentJsonConfig } from "helpers/modifyJsonFile"
import { withStateLogger } from "helpers/withStateLogger"
import { Tsconfig } from "tsconfig-type"

export const addTypescript = withStateLogger({ id: "TypeScript" }, async (config: Config) => {
  await installPackage(config, ["typescript", "@types/node"])

  const tsConfigObject: Tsconfig = {
    compilerOptions: {
      target: "ES2020",
      lib: ["ES2020"],
      module: "ES2020",
      moduleResolution: "Node",
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
      exactOptionalPropertyTypes: false,
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
  await augmentJsonConfig<Tsconfig>(config, "tsconfig.json", tsConfigObject)

  const tsConfigBuildObject: Tsconfig = {
    extends: "./tsconfig.json",
    compilerOptions: {
      noEmit: false,
      sourceMap: false,
      declarationMap: false,
    },
  }
  await augmentJsonConfig(config, "tsconfig.build.json", tsConfigBuildObject)

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
