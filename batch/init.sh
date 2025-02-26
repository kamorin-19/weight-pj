#!/bin/bash
set -e

# mysqld をバックグラウンドで起動
echo "Starting mysqld in background..."
mysqld --daemonize

# MySQLが起動するまで待機（TCP接続でチェック）
echo "Waiting for MySQL to be ready..."
until mysqladmin ping -h127.0.0.1 -u root -p"rootpassword" --protocol=tcp --silent; do
  echo "MySQL is not ready yet, waiting..."
  sleep 2
done

# 指定したデータベース内に「users」というテーブルが存在するかチェック
echo "Checking if table 'users' exists in database 'weight_admin'..."
TABLE_EXISTS=$(mysql -u root -p"rootpassword" -D "weight_admin" -e "SHOW TABLES LIKE 'users';" | grep users || true)

if [ -z "$TABLE_EXISTS" ]; then
    echo "Table 'users' not found. Creating table..."
    mysql -u root -p"rootpassword" -D "weight_admin" < /docker-entrypoint-initdb.d/create_users.sql
else
    echo "Table 'users' already exists. No action needed."
fi

# mysqld をフォアグラウンドに切り替える（もし必要なら）
exec mysqld
