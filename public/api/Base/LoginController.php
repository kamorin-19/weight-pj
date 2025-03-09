<?php
// api/LoginController.php

// CORSヘッダーを追加
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// OPTIONSリクエストの場合は、ここで処理を終了
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

class LoginController {
    private static function getDbConnection(): PDO {
        $host = 'mysql';  // Docker compose のサービス名
        $dbname = 'weight_admin';
        $username = 'user';
        $password = 'userpassword';

        try {
            $pdo = new PDO(
                "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
                $username,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
            return $pdo;
        } catch (PDOException $e) {
            http_response_code(500);
            die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
        }
    }

    /**
     * ログイン処理を行うメソッド
     * @return array レスポンスデータ
     */
    public static function login(): array {
        // リクエストボディのJSONデータを取得
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        // 入力チェック（username と password があるかどうか）
        if (isset($data['username'], $data['password'])) {
            try {
                $pdo = self::getDbConnection();
                $stmt = $pdo->prepare('SELECT * FROM users WHERE name = :username');
                $stmt->execute(['username' => $data['username']]);
                $user = $stmt->fetch();

                if ($user && $data['password'] === $user['password']) {
                    return ['message' => 'Login successful', 'user_id' => $user['id']];
                } else {
                    http_response_code(401);
                    return ['error' => 'Invalid credentials'];
                }
            } catch (PDOException $e) {
                http_response_code(500);
                return ['error' => 'Database error: ' . $e->getMessage()];
            }
        } else {
            http_response_code(400);
            return ['error' => 'Bad Request: Missing username or password'];
        }
    }
}
