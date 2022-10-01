import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { writeAndAddJsonConfig } from "helpers/modifyJsonFile"
import { withStateLogger } from "helpers/withStateLogger"

export const addVscodeSettings = withStateLogger(
  {
    id: "vscodesettings",
    message: "Adding vscode extension and setting recommendations",
    completed: "Added vscode recommendations",
  },
  async (config: Config) => {
    await writeAndAddJsonConfig(config, ".vscode/settings.json", generateVscodeSettings())
    await writeAndAddJsonConfig(config, ".vscode/extensions.json", generateVscodeExtensions())

    await commitWithAuthor(config, "Add vscode settings")
  }
)

const generateVscodeSettings = () => {
  return {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "[typescriptreact]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
    },
    "[typescript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
    },
    "[javascriptreact]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
    },
    "[javascript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
    },
    "[jsonc]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
    },
    "[json]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
    },
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true,
    },
    "gitlens.hovers.currentLine.over": "line",
    "editor.tabCompletion": "on",
    "editor.inlineSuggest.enabled": true,
    "typescript.updateImportsOnFileMove.enabled": "always",
    "eslint.packageManager": "yarn",
    "eslint.validate": ["javascript", "typescript", "html", "javascriptreact", "typescriptreact"],
    "editor.quickSuggestions": {
      strings: true,
    },
    "typescript.preferences.importModuleSpecifier": "non-relative",
    "jest.nodeEnv": {
      NODE_OPTIONS: "--experimental-vm-modules",
    },
  }
}

const generateVscodeExtensions = () => {
  return {
    recommendations: [
      "dbaeumer.vscode-eslint",
      "eamodio.gitlens",
      "wix.vscode-import-cost",
      "orta.vscode-jest",
      "esbenp.prettier-vscode",
    ],
  }
}
