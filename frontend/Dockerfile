FROM node:20
WORKDIR /app

# package.jsonをコピーして依存関係をインストール
COPY package*.json ./
RUN npm install

# アプリケーションコードをコピー
COPY . .

# Viteのデフォルトポート5173を公開
EXPOSE 5173

# 開発サーバー起動（package.jsonのdevスクリプトを使用）
CMD ["npm", "run", "dev"]