import { addToGitIgnore } from "helpers/addToGitIgnore"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { installPackage } from "helpers/installPackage"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { PackageManager } from "install-pnpm-package/dist/detectPackageManager"

export const addTypescript = async (targetDir: string, packageManager: PackageManager) => {
  await installPackage(targetDir, packageManager, ["typescript", "@types/node"])

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
  await writeAndAddFile(targetDir, "tsconfig.json", JSON.stringify(tsConfigObject, null, 2))

  const tsConfigBuildObject = {
    extends: "./tsconfig.json",
    compilerOptions: {
      noEmit: false,
      sourceMap: false,
      declarationMap: false,
    },
  }
  await writeAndAddFile(targetDir, "tsconfig.build.json", JSON.stringify(tsConfigBuildObject, null, 2))

  await addToGitIgnore(targetDir, "typescript", ["*.tsbuildinfo", "dist/"])

  await commitWithAuthor(targetDir, "Install typescript")
}
