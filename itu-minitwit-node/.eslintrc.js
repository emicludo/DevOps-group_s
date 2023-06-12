module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    mocha: true,
    node: true,
  },
  globals: {
    Cypress: "readonly",
    cy: "readonly",
  },
  extends: "eslint:recommended",
  overrides: [
    {
      "files": ["**/*.js"],
      "excludedFiles": ["bin/*.js"],
    }
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {},
  ignorePatterns: ['./bin/'],
};
