import { addPackageJsonToGit } from "helpers/addPackageJsonToGit"
import { addToGitIgnore } from "helpers/addToGitIgnore"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { installPackagePnpm } from "install-pnpm-package"

export const addTypescript = async (targetDir: string) => {
  await installPackagePnpm(["typescript", "@types/node"], { directory: targetDir, type: "dev" })
  await addPackageJsonToGit(targetDir)

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

  await addToGitIgnore(targetDir, "typescript", ["*.tsbuildinfo", "dist/"])

  await commitWithAuthor(targetDir, "Install typescript")
}
