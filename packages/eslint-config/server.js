const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use server side
 * typescript packages.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    "@vercel/style-guide/eslint/node",
    "@vercel/style-guide/eslint/typescript",
  ].map(require.resolve),
  parserOptions: {
    project,
  },
  env: {
    node: true,
    es6: true,
  },
  files: ["**/*.ts"],
  ignorePatterns: ["node_modules/", "dist/"],
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  rules: {
    semi: "warn",
    curly: "error",
    eqeqeq: ["error", "always"],
    "no-unused-vars": "warn",
    "no-unused-expressions": "warn",
    "no-console": "warn",
    "consistent-return": "error",
    "no-else-return": "error",
    "no-empty-function": "error",
    "no-multiple-empty-lines": ["error", { max: 1 }],
    "no-var": "error",
    "prefer-const": "error",
    "prefer-arrow-callback": "error",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": [
      "warn",
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
  },
};
