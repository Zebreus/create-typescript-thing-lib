import { Eslintrc } from "eslintrc-type"
import { addESMExportFile } from "helpers/addJsExportFile"
import { addScriptToPackage } from "helpers/addScriptToPackage"
import { addToGitIgnore } from "helpers/addToGitIgnore"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { modifyJsonConfig } from "helpers/modifyJsonFile"
import { withStateLogger } from "helpers/withStateLogger"
import { deleteAndAddFile, writeAndAddFile } from "helpers/writeAndAddFile"
import { Tsconfig } from "tsconfig-type"
import { PackageJson } from "types-package-json"

export const setupNextJs = withStateLogger(
  {
    id: "nextjs",
    message: "Configuring nextjs project",
    failed: "Failed to configure nextjs",
    completed: "Configured project as nextjs",
  },
  async (config: Config) => {
    await installPackage(config, ["next"], { prod: true })
    await installPackage(config, ["@next/eslint-plugin-next"])

    await modifyJsonConfig<Tsconfig>(config, "tsconfig.json", tsconfigJson => ({
      ...tsconfigJson,
      compilerOptions: {
        ...tsconfigJson.compilerOptions,
        jsx: "preserve",
        incremental: true,
        allowJs: false,
      },
      include: [...new Set([...(tsconfigJson.include ?? []), "next-env.d.ts", "next.config.js"] as const)],
    }))

    await deleteAndAddFile(config, "tsconfig.build.json")

    const nextConfig = {
      reactStrictMode: true,
      swcMinify: true,
    }

    await addESMExportFile(config, "next.config.mjs", nextConfig)
    await addToGitIgnore(config, "next", ["next-env.d.ts", ".vercel", "/.next", "/out", "/build", ".env*.local"])

    await modifyJsonConfig<Omit<PackageJson, "keywords"> & { keywords?: string[] }>(
      config,
      "package.json",
      packageJson => ({
        ...packageJson,
        keywords: [...new Set([...(packageJson.keywords || []), "nextjs"])],
      })
    )

    await modifyJsonConfig<Eslintrc>(config, ".eslintrc.json", eslintrcJson => ({
      ...eslintrcJson,
      extends: [...new Set([...(eslintrcJson.extends ?? []), "plugin:@next/next/core-web-vitals"])],
      rules: {
        ...(eslintrcJson.rules || {}),
        "jsx-a11y/alt-text": [
          "error",
          {
            elements: ["img"],
            img: ["Image"],
          },
        ],
      },
    }))

    await writeAndAddFile(config, "src/pages/index.tsx", getIndexPage())
    await writeAndAddFile(config, "src/components/Demo.tsx", getDemoComponent())
    await writeAndAddFile(config, "src/hooks/useToggle.ts", getToggleHook())

    await addScriptToPackage(config, "start", "next dev")
    await addScriptToPackage(config, "start:build", "next start")
    await addScriptToPackage(config, "build", "next build")

    await commitWithAuthor(config, "Setup nextjs app")
  }
)

const getIndexPage = () => `import { Demo } from "components/Demo"

const Page = () => {
  return (
    <div>
      <h1>My page</h1>
      <p>Content</p>
      <Demo />
    </div>
  )
}

export default Page`

const getDemoComponent = () => `import { css } from "@emotion/react"
import { useToggle } from "hooks/useToggle"

export const Demo = () => {
  const [state, toggle] = useToggle()
  
  return (
    <button onClick={toggle}
      css={css\`
        background-color: \${state ? "red" : "blue"};
      \`}
    >
      Click to toggle color
    </button>
  )
}`

const getToggleHook = () => `import { useCallback, useState } from "react"

export const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState)
  const toggle = useCallback(() => setState(state => !state), [])
  return [state, toggle] as const
}`
