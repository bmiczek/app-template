export default {
  // TypeScript and TSX files - lint and format
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],

  // JavaScript and config files - format only
  '*.{js,mjs,cjs}': ['prettier --write'],

  // JSON, YAML, Markdown - format only
  '*.{json,yaml,yml,md}': ['prettier --write'],

  // CSS files
  '*.css': ['prettier --write'],
};
