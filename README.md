# weight-pj
体重管理のプロジェクト

## 実施手順
### TypeScript導入
1.コンテナ作成後、コンテナ内で「tsc --init」
2.ルートフォルダーで「tsc」でソースをコンパイル

### ESLint/Prettier導入
1.コンテナ内で「npm init -y」
2.コンテナ内で「npm install --save-dev eslint」
3.コンテナ内で「npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin」
4.コンテナ内で「npm install --save-dev prettier」
5.コンテナ内で「npm install --save-dev eslint-config-prettier eslint-plugin-prettier」
6.コンテナ内で「npx eslint --init」
7.コンテナ内で「npx eslint .」
8.コンテナ内で「npx eslint . --fix」
9.コンテナ内で「npx prettier --check .」
10.コンテナ内で「npx prettier --write .」
npm run lint
npm run lint:fix
npm run format

### axiosをインストール
1.docker exec -it 7c3681b70199 /bin/bash
2.npm install axios