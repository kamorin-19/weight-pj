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

# ユーザーテーブルが存在しない場合は作成
if [ -z "$TABLE_EXISTS" ]; then
    echo "Table 'users' not found. Creating table..."
    mysql -u root -p"rootpassword" -D "weight_admin" < /docker-entrypoint-initdb.d/create_users.sql
else
    echo "Table 'users' already exists. No action needed."
fi

# 指定したデータベース内に「muscle_groups」というテーブルが存在するかチェック
echo "Checking if table 'muscle_groups' exists in database 'weight_admin'..."
TABLE_EXISTS=$(mysql -u root -p"rootpassword" -D "weight_admin" -e "SHOW TABLES LIKE 'muscle_groups';" | grep muscle_groups || true)

# 部位テーブルが存在しない場合は作成
if [ -z "$TABLE_EXISTS" ]; then
    echo "Table 'muscle_groups' not found. Creating table..."
    mysql -u root -p"rootpassword" -D "weight_admin" < /docker-entrypoint-initdb.d/create_muscle_groups.sql
else
    echo "Table 'muscle_groups' already exists. No action needed."
fi

# 指定したデータベース内に「exercises」というテーブルが存在するかチェック
echo "Checking if table 'exercises' exists in database 'weight_admin'..."
TABLE_EXISTS=$(mysql -u root -p"rootpassword" -D "weight_admin" -e "SHOW TABLES LIKE 'exercises';" | grep exercises || true)

# 種目テーブルが存在しない場合は作成
if [ -z "$TABLE_EXISTS" ]; then
    echo "Table 'exercises' not found. Creating table..."
    mysql -u root -p"rootpassword" -D "weight_admin" < /docker-entrypoint-initdb.d/create_exercises.sql
else
    echo "Table 'exercises' already exists. No action needed."
fi

# 指定したデータベース内に「daily_weights」というテーブルが存在するかチェック
echo "Checking if table 'daily_weights' exists in database 'weight_admin'..."
TABLE_EXISTS=$(mysql -u root -p"rootpassword" -D "weight_admin" -e "SHOW TABLES LIKE 'daily_weights';" | grep daily_weights || true)

# 体重記録テーブルが存在しない場合は作成
if [ -z "$TABLE_EXISTS" ]; then
    echo "Table 'daily_weights' not found. Creating table..."
    mysql -u root -p"rootpassword" -D "weight_admin" < /docker-entrypoint-initdb.d/create_daily_weights.sql
else
    echo "Table 'daily_weights' already exists. No action needed."
fi

# mysqld をフォアグラウンドに切り替える（もし必要なら）
exec mysqld
