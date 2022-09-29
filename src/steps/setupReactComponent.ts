import { appendScriptToPackage } from "helpers/addScriptToPackage"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { modifyJsonConfig } from "helpers/modifyJsonFile"
import { withStateLogger } from "helpers/withStateLogger"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { Tsconfig } from "tsconfig-type"
import { PackageJson } from "types-package-json"

export const setupReactComponent = withStateLogger(
  {
    id: "reactcomponent",
    message: "Configuring project as react component",
    failed: "Failed to configure as react component",
    completed: "Configured project as react component",
  },
  async (config: Config) => {
    await installPackage(config, ["@zebreus/resolve-tspaths@0.8.9"])
    await installPackage(config, ["react", "react-dom"], { peer: true })
    await installPackage(config, ["rollup", "rollup-plugin-typescript2", "@emotion/react"], { peer: true })

    await writeAndAddFile(config, "rollup.config.js", generateRollupConfig())

    await modifyJsonConfig<Tsconfig>(config, "tsconfig.json", tsconfigJson => ({
      ...tsconfigJson,
      compilerOptions: {
        ...tsconfigJson.compilerOptions,
        jsx: "react-jsx",
        jsxImportSource: "@emotion/react",
      },
    }))

    await modifyJsonConfig<Omit<PackageJson, "keywords"> & { keywords?: string[] }>(
      config,
      "package.json",
      packageJson => ({
        ...packageJson,
        files: [...new Set([...(packageJson.files || []), "dist/**"])],
        keywords: [...new Set([...(packageJson.keywords || []), "react", "component"])],
        main: "dist/index.js",
      })
    )

    await appendScriptToPackage(config, "build", "rm -rf dist && rollup -c")
    await appendScriptToPackage(config, "prepack", "rm -rf dist && rollup -c")

    await writeAndAddFile(config, "src/index.ts", generateComponentIndex())
    await writeAndAddFile(config, "src/DemoButton.tsx", generateDemoButton())

    await commitWithAuthor(config, "Setup react component")
  }
)

const generateComponentIndex = () => {
  return `export { DemoButton } from "DemoButton"
    `
}

const generateDemoButton = () => {
  return `export type DemoButtonProps = {
  text?: string
}
  export const DemoButton = ({text}: DemoButtonProps) => <button>{text ?? ""}</button>
    `
}

const generateRollupConfig = () => {
  return `import typescript from "rollup-plugin-typescript2"

const config = {
  input: "src/index.ts",
  output: [
    {
      file: dist/index.js,
      format: "esm",
      exports: "named",
      sourcemap: false,
      strict: false,
    },
  ],
  plugins: [typescript({ tsconfig: "tsconfig.build.json" })],
  external: ["react", "react-dom", "@emotion/react", "@emotion/react/jsx-runtime"],
}

export default config`
}
