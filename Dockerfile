FROM php:8.2-apache

# 1. Xdebugのインストール
RUN pecl install xdebug && \
    docker-php-ext-enable xdebug

# 2. Node.js と npm のインストール
#   (Debian系のパッケージを利用。必要に応じてバージョン管理方法を変更してください)
RUN apt-get update && \
    apt-get install -y nodejs npm && \
    # 3. TypeScriptのグローバルインストール
    npm install -g typescript && \
    # 不要ファイルの削除
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*