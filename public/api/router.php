<?php
// index.php (例: /api/index.php)

// リクエストURLからパス部分を取得する
$requestUri = $_SERVER['REQUEST_URI'];
// 例: "/api/sampleFile/sampleMethod?param=value"

// .htaccessのRewriteBaseに合わせて "/api/" を除去する
$basePath = '/api/';
$path = substr($requestUri, strlen($basePath));

// クエリパラメータがある場合は除去
$path = parse_url($path, PHP_URL_PATH);

// パスの先頭と末尾のスラッシュを取り除く
$path = trim($path, '/');

// パスをスラッシュで分割
$parts = explode('/', $path);

if (count($parts) < 2) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['error' => '不正なエンドポイントです。']);
    exit;
}

// フォルダ名とコントローラー名とメソッド名を取得
$folderName = $parts[0];
$controllerName = $parts[1];
$methodName = $parts[2];

// コントローラーファイルのパスを構築（.phpを付加）
$filePath = __DIR__ . '/' . $folderName . '/' . $controllerName . '.php';

if (!file_exists($filePath)) {
    header('HTTP/1.1 404 Not Found');
    echo json_encode(['error' => '指定されたファイルが見つかりません。: ' . $filePath]);
    exit;
}

// PHPファイルを読み込み
require_once($filePath);

// クラス名を構築
$className = $controllerName;

// メソッドが存在するか確認
if (!method_exists($className, $methodName)) {
    header('HTTP/1.1 404 Not Found');
    echo json_encode(['error' => '指定されたメソッドが存在しません。']);
    exit;
}

// 静的メソッドを呼び出して結果を取得
$result = call_user_func([$className, $methodName]);

// 結果をJSONとして返す
header('Content-Type: application/json');
echo json_encode($result);
