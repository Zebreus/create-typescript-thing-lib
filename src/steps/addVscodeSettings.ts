import { commitWithAuthor } from "helpers/commitWithAuthor"
import { writeAndAddFile } from "helpers/writeAndAddFile"

export const addVscodeSettings = async (targetDir: string) => {
  await writeAndAddFile(targetDir, ".vscode/settings.json", JSON.stringify(generateVscodeSettings(), null, 2))
  await writeAndAddFile(targetDir, ".vscode/extensions.json", JSON.stringify(generateVscodeExtensions(), null, 2))

  await commitWithAuthor(targetDir, "Add vscode settings")
}

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
    "editor.quickSuggestions": {
      strings: true,
    },
    "typescript.preferences.importModuleSpecifier": "non-relative",
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
