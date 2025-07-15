import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // For TypeScript projects
      "no-unused-vars": "off",// For JavaScript projects (if not using TypeScript ESLint)
      "react/no-unescaped-entities": 0
    }
  }),
];


export default eslintConfig;
