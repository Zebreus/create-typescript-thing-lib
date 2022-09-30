import { appendScriptToPackage } from "helpers/addScriptToPackage"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { modifyJsonConfig } from "helpers/modifyJsonFile"
import { withStateLogger } from "helpers/withStateLogger"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { Config as JestConfig } from "jest"
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
    await installPackage(config, ["react", "react-dom", "@emotion/react"], { prod: true })
    await installPackage(config, [
      "@zebreus/resolve-tspaths@0.8.9",
      "@types/react",
      "@types/react-dom",
      "jest-environment-jsdom",
      "@testing-library/react",
      "@testing-library/jest-dom",
    ])
    await installPackage(config, ["react", "react-dom"], { peer: true })

    // await writeAndAddFile(config, "rollup.config.js", generateRollupConfig())

    await modifyJsonConfig<Tsconfig>(config, "tsconfig.json", tsconfigJson => ({
      ...tsconfigJson,
      compilerOptions: {
        ...tsconfigJson.compilerOptions,
        jsx: "react-jsx",
        jsxImportSource: "@emotion/react",
      },
    }))

    await modifyJsonConfig<{ recommendations?: string[] }>(config, ".vscode/extensions.json", extensionsConfig => ({
      ...extensionsConfig,
      recommendations: [
        ...new Set([...(extensionsConfig.recommendations ?? []), "styled-components.vscode-styled-components"]),
      ],
    }))

    await modifyJsonConfig<JestConfig>(config, "jest.config.json", jestConfigJson => ({
      ...jestConfigJson,
      testEnvironment: "jsdom",
      setupFilesAfterEnv: [...new Set([...(jestConfigJson.setupFilesAfterEnv ?? []), "<rootDir>/jest-setup.ts"])],
    }))

    await writeAndAddFile(config, "jest-setup.ts", generateJestSetup())

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

    await writeAndAddFile(config, "src/index.ts", generateComponentIndex())
    await writeAndAddFile(config, "src/DemoButton.tsx", generateDemoButton())

    await commitWithAuthor(config, "Setup react component")
  }
)

const generateComponentIndex = () => {
  return `export { DemoButton } from "DemoButton"`
}

const generateDemoButton = () => {
  return `import { css } from "@emotion/react"

export type DemoButtonProps = {
  text?: string
}
export const DemoButton = ({ text }: DemoButtonProps) => (
  <button
    css={css\`
      padding: 32px;
      background-color: hotpink;
      font-size: 24px;
      border-radius: 4px;
      &:hover {
        color: green;
      }
    \`}
  >
    {text ?? "content"}
  </button>
)`
}

const generateJestSetup = () => {
  return `// eslint-disable-next-line import/no-unassigned-import
import "@testing-library/jest-dom"`
}

// const generateButtonTest = () => {

// }

// const generateRollupConfig = () => {
//   return `import typescript from "rollup-plugin-typescript2"

// const config = {
//   input: "src/index.ts",
//   output: [
//     {
//       file: "dist/index.js",
//       format: "esm",
//       exports: "named",
//       sourcemap: false,
//       strict: false,
//     },
//   ],
//   plugins: [typescript({ tsconfig: "tsconfig.build.json" })],
//   external: ["react", "react-dom", "@emotion/react", "@emotion/react/jsx-runtime"],
// }

// export default config`
// }
