import { Eslintrc } from "eslintrc-type"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { modifyJsonConfig } from "helpers/modifyJsonFile"
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

  await modifyJsonConfig<Eslintrc>(config, ".eslintrc.json", eslintrcJson => ({
    ...eslintrcJson,
    extends: [
      ...new Set([
        ...(eslintrcJson.extends ?? []),
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
      ]),
    ],
    plugins: [...new Set([...(eslintrcJson.plugins ?? []), "react", "react-hooks", "jsx-a11y"])],
    rules: {
      ...(eslintrcJson.rules || {}),
      "react/no-unknown-property": "off",
      "react/prop-types": "off",
    },
  }))

  await modifyJsonConfig<Tsconfig>(config, "tsconfig.json", tsconfigJson => ({
    ...tsconfigJson,
    compilerOptions: {
      ...tsconfigJson.compilerOptions,
      lib: [...new Set([...(tsconfigJson.compilerOptions?.lib ?? []), "DOM", "DOM.Iterable"] as const)],
      jsx: "react-jsx",
    },
  }))

  await modifyJsonConfig<JestConfig>(config, "jest.config.json", jestConfigJson => ({
    ...jestConfigJson,
    testEnvironment: "jsdom",
    setupFilesAfterEnv: [...new Set([...(jestConfigJson.setupFilesAfterEnv ?? []), "<rootDir>/jest-setup.ts"])],
  }))

  await writeAndAddFile(config, "jest-setup.ts", generateJestSetup())

  await commitWithAuthor(config, "Install react")
})

const generateJestSetup = () => {
  return `// eslint-disable-next-line import/no-unassigned-import
  import "@testing-library/jest-dom"`
}
