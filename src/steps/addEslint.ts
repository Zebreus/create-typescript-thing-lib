import { addScriptToPackage } from "helpers/addScriptToPackage"
import { addToGitIgnore } from "helpers/addToGitIgnore"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { installPackage } from "helpers/installPackage"
import { withStateLogger } from "helpers/withStateLogger"
import { writeAndAddFile } from "helpers/writeAndAddFile"

export const addEslint = withStateLogger({ id: "eslint" }, async (config: Config) => {
  await installPackage(config, [
    "eslint@8.23.1",
    "@types/eslint@8.4.6",
    "@typescript-eslint/eslint-plugin@5.37.0",
    "@typescript-eslint/parser@5.37.0",
    "eslint-plugin-import@2.26.0",
    "eslint-import-resolver-typescript@3.5.1",
  ])

  const eslintRcObject = {
    extends: ["eslint:recommended", "plugin:import/recommended", "plugin:jest/recommended"],
    plugins: ["import"],
    rules: {
      "no-undef": "off",
      "no-unused-vars": [
        "off",
        {
          ignoreRestSiblings: true,
        },
      ],
      "import/no-duplicates": [
        "error",
        {
          considerQueryString: true,
        },
      ],
      "import/named": "off",
      "import/first": "error",
      "import/no-namespace": "error",
      "import/extensions": [
        "error",
        "always",
        {
          js: "never",
          jsx: "never",
          ts: "never",
          tsx: "never",
        },
      ],
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
      "import/no-useless-path-segments": [
        "error",
        {
          noUselessIndex: true,
        },
      ],
      "import/no-relative-packages": "error",
      "import/no-unused-modules": "error",
      "import/no-deprecated": "error",
      "import/no-commonjs": "error",
      "import/no-amd": "error",
      "import/no-mutable-exports": "error",
      "import/no-unassigned-import": "error",
      "jest/expect-expect": "off",
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
        node: true,
      },
    },
    overrides: [
      {
        files: ["src/**/*.ts", "src/**/*.tsx"],
        extends: [
          "eslint:recommended",
          "plugin:@typescript-eslint/eslint-recommended",
          "plugin:@typescript-eslint/recommended",
          "plugin:import/recommended",
          "plugin:jest/recommended",
        ],
        plugins: ["import", "@typescript-eslint"],
        rules: {
          "@typescript-eslint/explicit-module-boundary-types": "off",
          "@typescript-eslint/no-unused-vars": [
            "error",
            {
              ignoreRestSiblings: true,
            },
          ],
          "@typescript-eslint/switch-exhaustiveness-check": "error",
          "@typescript-eslint/no-empty-function": "off",
        },
        parserOptions: {
          parser: "@typescript-eslint/parser",
          ecmaVersion: 2018,
          sourceType: "module",
          project: "./tsconfig.json",
        },
      },
    ],
  }

  await writeAndAddFile(config, ".eslintrc.json", JSON.stringify(eslintRcObject, null, 2))

  await addScriptToPackage(config, "lint", "eslint --cache && tsc --noEmit")
  await addToGitIgnore(config, "eslint", ".eslintcache")

  await commitWithAuthor(config, "Install eslint")
})
