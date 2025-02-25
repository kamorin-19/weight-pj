<?php
// api/TwoFactorAuthentication.php

// CORSヘッダーを追加
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// OPTIONSリクエストの場合は、ここで処理を終了
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

class TwoFactorAuthenticationController {
    /**
     * 二要素認証を行うメソッド
     * @return array レスポンスデータ
     */
    public static function Authentication(): array {
        // TODO: 実装
        return ['message' => 'Login successful'];
    }
}
