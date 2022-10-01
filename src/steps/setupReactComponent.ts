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
    await installPackage(config, ["@zebreus/resolve-tspaths@0.8.10"])
    await installPackage(config, ["react", "react-dom"], { peer: true })

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

    await writeAndAddFile(config, "src/index.ts", generateComponentIndex())
    await writeAndAddFile(config, "src/Button.tsx", generateDemoButton())
    await writeAndAddFile(config, "src/tests/button.test.tsx", generateButtonTest())

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
