export default {
  // TypeScript and TSX files - lint, format, and type-check
  // The function form ignores staged file paths since tsc requires the full project
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write', () => 'pnpm type-check'],

  // JavaScript and config files - format only
  '*.{js,mjs,cjs}': ['prettier --write'],

  // JSON, YAML, Markdown - format only
  '*.{json,yaml,yml,md}': ['prettier --write'],

  // CSS files
  '*.css': ['prettier --write'],
};
