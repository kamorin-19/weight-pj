// eslint.config.mjs (ES Modules形式)

// 1. ESLint本体（@eslint/js）の推奨設定をimport
import js from '@eslint/js'

// 2. TypeScript用パーサ・プラグイン
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'

// 3. Prettier連携用プラグイン/設定
import pluginPrettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

export default [
  {
    // (A) 無視ファイルの指定（node_modules、ビルド成果物など）
    ignores: ['node_modules', 'dist', 'build'],
  },
  {
    // (B) メイン設定ブロック
    //     対象とするファイル拡張子を指定
    files: ['**/*.js', '**/*.ts'],

    // (1) languageOptions
    languageOptions: {
      parser: tsParser, // TypeScript パーサ
      ecmaVersion: 'latest', // ECMAScriptバージョン
      sourceType: 'module', // import/exportを使用
    },

    // (2) plugins: ここでプラグインを読み込み
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: pluginPrettier,
    },

    // (3) rules: 各推奨設定 & Prettier連携
    rules: {
      // 1) ESLint本体の推奨ルール
      ...js.configs.recommended.rules,

      // 2) TypeScript推奨ルール
      ...tsPlugin.configs.recommended.rules,

      // 3) Prettier連携ルール
      //    → plugin:prettier/recommended と同等
      ...pluginPrettier.configs.recommended.rules,

      // 4) eslint-config-prettier による競合ルールOFF
      ...configPrettier,

      // --- (任意) カスタムで追加・上書きする場合は下に追記 ---
      // 例: "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]
