import { addScriptToPackage } from "helpers/addScriptToPackage"
import { addToGitIgnore } from "helpers/addToGitIgnore"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { augmentJsonConfig } from "helpers/modifyJsonFile"
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
    await installPackage(config, ["@ladle/react"])
    await installPackage(config, ["react", "react-dom"], { peer: true })

    await augmentJsonConfig<Tsconfig>(config, "tsconfig.json", {
      compilerOptions: {
        jsx: "react-jsx",
        jsxImportSource: "@emotion/react",
      },
    })

    await augmentJsonConfig(config, ".vscode/launch.json", {
      version: "0.2.0",
      configurations: [
        {
          type: "chrome",
          request: "launch",
          name: "Attach to ladle server",
          url: "http://localhost:61000",
          webRoot: "${workspaceFolder}",
        },
      ],
    })

    await augmentJsonConfig<Tsconfig>(config, "tsconfig.build.json", {
      exclude: ["**/*.stories.tsx?"],
    })

    await augmentJsonConfig<Omit<Partial<PackageJson>, "keywords"> & { keywords?: string[] }>(config, "package.json", {
      files: ["dist/**"],
      keywords: ["react", "component"],
      main: "dist/index.js",
    })

    await writeAndAddFile(config, "src/index.ts", generateComponentIndex())
    await writeAndAddFile(config, "src/Button.tsx", generateDemoButton())
    await writeAndAddFile(config, "src/tests/button.test.tsx", generateButtonTest())
    await writeAndAddFile(config, "src/Button.stories.tsx", generateButtonStory())
    await writeAndAddFile(config, "vite.config.ts", generateViteConfig())

    await addToGitIgnore(config, "ladle", "/build")

    await addScriptToPackage(config, "start", "ladle serve")

    await commitWithAuthor(config, "Setup react component")
  }
)

const generateComponentIndex = () => {
  return `export { Button } from "Button"`
}

const generateDemoButton = () => {
  return `import { css } from "@emotion/react"

export type ButtonProps = {
  text?: string
  onClick?: () => void
}
export const Button = ({ text, onClick }: ButtonProps) => (
  <button
    css={css\`
      position: relative;
      background-color: transparent;
      padding: 0.4rem 0.8rem;
      border: 2px solid #333;
      text-align: center;
      transition: all 0.35s;

      &:hover {
        color: white;
      }

      &:before {
        position: absolute;
        content: "";
        inset: 0;
        width: 0;
        background: #ff003b;
        transition: all 0.35s;
        z-index: -1;
      }

      &:hover:before {
        width: 100%;
      }
    \`}
    onClick={onClick}
  >
    {text ?? ""}
  </button>
)`
}

const generateButtonTest = () => {
  return `import { fireEvent, render, screen } from "@testing-library/react"
import { Button } from "Button"

it("is actually a button", () => {
  const testMessage = "Test Message"
  render(<Button text={testMessage} />)

  expect(screen.queryByText(testMessage)).toBeInstanceOf(HTMLButtonElement)
})

it("calls onClick on clicks", () => {
  const onClick = jest.fn()
  render(<Button onClick={onClick} />)

  const buttonElement = screen.queryByRole("button")
  expect(buttonElement).toBeTruthy()
  if (!buttonElement) throw new Error()

  expect(onClick).toHaveBeenCalledTimes(0)
  fireEvent.click(buttonElement)
  expect(onClick).toHaveBeenCalledTimes(1)
})`
}

const generateButtonStory = () => `import { Button } from "Button"

export const Demo = () => <Button text="TestText" />`

const generateViteConfig = () => `import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
    }),
  ],
  esbuild: {
    jsx: "automatic",
  },
  optimizeDeps: {
    include: ["@emotion/react/jsx-dev-runtime"],
  },
})`
