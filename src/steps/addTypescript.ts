import { addToGitIgnore } from "helpers/addToGitIgnore"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { writeAndAddFile } from "helpers/writeAndAddFile"

export const addTypescript = async (config: Config) => {
  await installPackage(config, ["typescript", "@types/node"])

  const tsConfigObject = {
    compilerOptions: {
      target: "es2016",
      lib: ["es2016", "esnext"],
      jsx: "preserve",
      module: "commonjs",
      allowJs: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      outDir: "dist",
      noEmit: true,
      isolatedModules: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      strict: true,
      skipLibCheck: true,
      rootDir: "src",
      baseUrl: ".",
      paths: {
        "*": ["./src/*"],
      },
    },
    include: ["src/**/*"],
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

  await addToGitIgnore(config, "typescript", ["*.tsbuildinfo", "dist/"])

  await commitWithAuthor(config, "Install typescript")
}
