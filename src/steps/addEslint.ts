import { addScriptToPackage } from "helpers/addScriptToPackage"
import { addToGitIgnore } from "helpers/addToGitIgnore"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { installPackage } from "helpers/installPackage"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { PackageManager } from "install-pnpm-package/dist/detectPackageManager"

export const addEslint = async (targetDir: string, packageManager: PackageManager) => {
  await installPackage(targetDir, packageManager, [
    "eslint",
    "@types/eslint",
    "@typescript-eslint/eslint-plugin@latest",
    "@typescript-eslint/parser@latest",
    "eslint-plugin-import@latest",
    "eslint-import-resolver-typescript@latest",
  ])

  const eslintRcObject = {
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:import/recommended",
    ],
    plugins: ["import", "@typescript-eslint"],
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/no-empty-function": "off",

      "no-undef": "off",
      "no-unused-vars": ["off", { ignoreRestSiblings: true }],

      "import/no-duplicates": ["error", { considerQueryString: true }],
      "import/named": "off",

      "import/first": "error",
      "import/no-namespace": "error",
      "import/extensions": ["error", "always", { js: "never", jsx: "never", ts: "never", tsx: "never" }],
      "import/order": [
        "error",
        {
          groups: [
            ["internal", "external", "builtin"],
            ["parent", "sibling", "index"],
          ],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/newline-after-import": "error",
      "import/no-anonymous-default-export": "error",
      "import/no-dynamic-require": "error",
      "import/no-self-import": "error",
      "import/no-useless-path-segments": ["error", { noUselessIndex: true }],
      "import/no-relative-packages": "error",
      "import/no-unused-modules": "error",
      "import/no-deprecated": "error",
      "import/no-commonjs": "error",
      "import/no-amd": "error",
      "import/no-mutable-exports": "error",
      "import/no-unassigned-import": "error",
    },
    overrides: [
      {
        files: ["*.ts", "*.tsx"],
        parserOptions: {
          parser: "@typescript-eslint/parser",
          ecmaVersion: 2018,
          sourceType: "module",
          project: "./tsconfig.json",
        },
        settings: {
          "import/external-module-folders": ["node_modules", "node_modules/@types"],
          "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
          },
          "import/resolver": {
            typescript: {
              alwaysTryTypes: true,
              project: "<root>/tsconfig.json",
            },
          },
        },
      },
    ],
  }

  await writeAndAddFile(targetDir, ".eslintrc.json", JSON.stringify(eslintRcObject, null, 2))

  await addScriptToPackage(targetDir, "lint", "eslint --cache && tsc --noEmit")
  await addToGitIgnore(targetDir, "eslint", ".eslintcache")

  await commitWithAuthor(targetDir, "Install eslint")
}
