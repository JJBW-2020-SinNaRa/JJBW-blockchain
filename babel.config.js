const tscOption = {
  isTSX: false,
  jsxPragma: "React",
  allExtensions: false,
  allowNamespaces: true,
  allowDeclareFields: true,
  onlyRemoveTypeImports: true,
};
const envOption = {
  targets: {
    node: "current",
  },
  useBuiltIns: "usage",
  bugfixes: true,
  corejs: {
    version: 3,
    proposals: true,
  },
};
const aliasOption = {
  root: [
    "./src",
  ],
  alias: {
    src: "./src",
  },
};
const decoratorsOption = {
  legacy: true,
};
const classPropertiesOption = {
  loose: true,
};
module.exports = {
  presets: [
    ["@babel/preset-typescript", tscOption],
    ["@babel/preset-env", envOption],
  ],
  plugins: [
    ["module-resolver", aliasOption],
    ["@babel/plugin-proposal-decorators", decoratorsOption],
    ["@babel/plugin-proposal-class-properties", classPropertiesOption],
  ],
};
