import { Eslintrc } from "eslintrc-type"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { augmentJsonConfig } from "helpers/modifyJsonFile"
import { withStateLogger } from "helpers/withStateLogger"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { Config as JestConfig } from "jest"
import { Tsconfig } from "tsconfig-type"

export const addReact = withStateLogger({ id: "react" }, async (config: Config) => {
  await installPackage(config, ["react", "react-dom"], { prod: true })
  await installPackage(config, [
    "@types/react",
    "@types/react-dom",
    "jest-environment-jsdom",
    "@testing-library/react",
    "@testing-library/jest-dom",
    "eslint-plugin-jsx-a11y",
    "eslint-plugin-react",
    "eslint-plugin-react-hooks",
  ])

  await augmentJsonConfig<
    Eslintrc & {
      rules?: Record<string, unknown>
    }
  >(config, ".eslintrc.json", {
    extends: [
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
      "plugin:react-hooks/recommended",
      "plugin:jsx-a11y/recommended",
    ],
    plugins: ["react", "react-hooks", "jsx-a11y"],
    rules: {
      "react/no-unknown-property": "off",
      "react/prop-types": "off",
    },
  })

  await augmentJsonConfig<Tsconfig>(config, "tsconfig.json", {
    compilerOptions: {
      lib: ["DOM", "DOM.Iterable"],
      jsx: "react-jsx",
    },
  })

  await augmentJsonConfig<JestConfig>(config, "jest.config.json", {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  })

  await writeAndAddFile(config, "jest-setup.ts", generateJestSetup())

  await commitWithAuthor(config, "Install react")
})

const generateJestSetup = () => {
  return `// eslint-disable-next-line import/no-unassigned-import
  import "@testing-library/jest-dom"`
}
