/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "vue/html-indent": ["off"], // conflicts with IDEA formatting style
    "vue/max-attributes-per-line": ["off"],
    "vue/html-closing-bracket-spacing": ["off"],
  },
};
