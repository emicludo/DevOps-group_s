module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    mocha: true,
  },
  extends: "eslint:recommended",
  overrides: [
    {
      "files": ["**/*.js"],
    }
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {},
};
