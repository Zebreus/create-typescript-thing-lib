import { Eslintrc } from "eslintrc-type"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { modifyJsonConfig } from "helpers/modifyJsonFile"
import { withStateLogger } from "helpers/withStateLogger"
import { Tsconfig } from "tsconfig-type"

export const addEmotion = withStateLogger({ id: "emotion" }, async (config: Config) => {
  await installPackage(config, ["@emotion/react"], { prod: true })
  await installPackage(config, ["@emotion/eslint-plugin"])

  await modifyJsonConfig<Eslintrc>(config, ".eslintrc.json", eslintrcJson => ({
    ...eslintrcJson,
    plugins: [...new Set([...(eslintrcJson.plugins ?? []), "@emotion"])],
    rules: {
      ...(eslintrcJson.rules || {}),
      "@emotion/no-vanilla": "error",
      "@emotion/syntax-preference": ["error", "string"],
    },
  }))

  await modifyJsonConfig<Tsconfig>(config, "tsconfig.json", tsconfigJson => ({
    ...tsconfigJson,
    compilerOptions: {
      ...tsconfigJson.compilerOptions,
      jsxImportSource: "@emotion/react",
    },
  }))

  await modifyJsonConfig<{ recommendations?: string[] }>(config, ".vscode/extensions.json", extensionsConfig => ({
    ...extensionsConfig,
    recommendations: [
      ...new Set([...(extensionsConfig.recommendations ?? []), "styled-components.vscode-styled-components"]),
    ],
  }))

  await commitWithAuthor(config, "Install emotion")
})
