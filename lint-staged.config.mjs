const lintStagedConfig = {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,css,md,mjs}": ["prettier --write"],
};

export default lintStagedConfig;
