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
            // ここではシンプルな固定値チェックを実施しています。
            // 実際はDBでの認証処理などを行ってください。
            if ($data['username'] === 'admin' && $data['password'] === 'secret') {
                return ['message' => 'Login successful'];
            } else {
                http_response_code(401);
                return ['error' => 'Invalid credentials'];
            }
        } else {
            http_response_code(400);
            return ['error' => 'Bad Request: Missing username or password'];
        }
    }
}
