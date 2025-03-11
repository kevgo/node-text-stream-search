// @ts-check

import tslintPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import perfectionist from "eslint-plugin-perfectionist"

export default [
  {
    files: ["src/*.ts"],
    ignores: ["node_modules/", ".git/", "dist/", "text-runner/"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        console: "readonly",
        module: "readonly",
        process: "readonly"
      },
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig-build.json"
      },
      sourceType: "module"
    },
    plugins: {
      "@typescript-eslint": tslintPlugin
    },
    rules: {
      ...tslintPlugin.configs.recommended.rules,
      "no-empty-function": "error",
      "prefer-const": "error"
    }
  },
  perfectionist.configs["recommended-natural"]
]
