import { Eslintrc } from "eslintrc-type"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { augmentJsonConfig } from "helpers/modifyJsonFile"
import { withStateLogger } from "helpers/withStateLogger"
import { Tsconfig } from "tsconfig-type"

export const addEmotion = withStateLogger({ id: "emotion" }, async (config: Config) => {
  await installPackage(config, ["@emotion/react"], { prod: true })
  await installPackage(config, ["@emotion/eslint-plugin"])

  await augmentJsonConfig<
    Eslintrc & {
      rules?: Record<string, unknown>
    }
  >(config, ".eslintrc.json", {
    plugins: ["@emotion"],
    rules: {
      "@emotion/no-vanilla": "error",
      "@emotion/syntax-preference": ["error", "string"],
    },
  })

  await augmentJsonConfig<Tsconfig>(config, "tsconfig.json", {
    compilerOptions: {
      jsxImportSource: "@emotion/react",
    },
  })

  await augmentJsonConfig<{ recommendations?: string[] }>(config, ".vscode/extensions.json", {
    recommendations: ["styled-components.vscode-styled-components"],
  })

  await commitWithAuthor(config, "Install emotion")
})
