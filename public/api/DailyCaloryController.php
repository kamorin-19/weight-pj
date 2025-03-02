<?php
// api/MuscleGroupsController.php

// CORSヘッダーを追加
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// OPTIONSリクエストの場合は、ここで処理を終了
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

class DailyCaloryController {

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
     * カロリーを取得するメソッド
     * @return array レスポンスデータ
     */
    public static function getDailyCalories(): array {

        try {
            $pdo = self::getDbConnection();
            $stmt = $pdo->prepare('SELECT * FROM daily_calories ORDER BY record_date DESC');
            $stmt->execute();
            $dailyCalories = $stmt->fetchAll();

            // カロリー記録を格納する配列を初期化
            $dailyCaloryRecords = [];
            
            // 各部位の名前を配列に格納
            foreach ($dailyCalories as $dailyCalory) {
                // 種目情報を配列に格納
                $dailyCaloryRecords[] = [
                    'calory' => $dailyCalory['calory'],
                    'record_date' => $dailyCalory['record_date'],
                ];
            }
            
            // 元の$dailyCaloriesを$dailyCaloryRecordsで上書き
            $dailyCalories = $dailyCaloryRecords;

            if ($dailyCalories) {
                return ['message' => 'Get successful', 'dailyCalories' => $dailyCalories];
            } else {
                return ['message' => 'No Data'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Database error: ' . $e->getMessage()];
        }
    }

    /**
     * カロリー記録を新規作成するメソッド
     * @return array レスポンスデータ
     */
    public static function createDailyCalory(): array {
        // リクエストボディからJSONを取得
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        
        // 日付が提供されているか確認
        if (!isset($data['recordedDate']) || empty($data['recordedDate'])) {
            http_response_code(400);
            return ['message' => 'Recorded-date is required'];
        }

        // カロリーが提供されているか確認
        if (!isset($data['dailyCalory']) || empty($data['dailyCalory'])) {
            http_response_code(400);
            return ['message' => 'Daily-calory is required'];
        }
        
        $recordedDate = date('Y-m-d', strtotime($data['recordedDate']));
        $dailyCalory = $data['dailyCalory'];
        $userId = 1;
        
        try {
            $pdo = self::getDbConnection();
            
            // 同じ日付のカロリー記録が既に存在するか確認
            $checkStmt = $pdo->prepare('SELECT COUNT(*) FROM daily_calories WHERE record_date = :record_date');
            $checkStmt->bindParam(':record_date', $recordedDate, PDO::PARAM_STR);
            $checkStmt->execute();
            
            if ($checkStmt->fetchColumn() > 0) {
                http_response_code(409); // Conflict
                return ['message' => 'Daily calory with this date already exists'];
            }
            
            // 新しいカロリー記録を挿入
            $insertStmt = $pdo->prepare('INSERT INTO daily_calories (record_date, calory, user_id) VALUES (:record_date, :calory, :user_id)');
            $insertStmt->bindParam(':record_date', $recordedDate, PDO::PARAM_STR);
            $insertStmt->bindParam(':calory', $dailyCalory, PDO::PARAM_STR);
            $insertStmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $insertStmt->execute();
            
            return ['message' => 'Create successful', 'id' => $pdo->lastInsertId()];
        } catch (PDOException $e) {
            http_response_code(500);
            return ['message' => 'Database error: ' . $e->getMessage()];
        }
    }
}
