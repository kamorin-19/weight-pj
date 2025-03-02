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

class DailyWeightController {

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
     * 体重記録を取得するメソッド
     * @return array レスポンスデータ
     */
    public static function getDailyWeights(): array {

        try {
            $pdo = self::getDbConnection();
            $stmt = $pdo->prepare('SELECT * FROM daily_weights ORDER BY record_date DESC');
            $stmt->execute();
            $dailyWeights = $stmt->fetchAll();

            // 体重記録を格納する配列を初期化
            $dailyWeightRecords = [];
            
            // 各部位の名前を配列に格納
            foreach ($dailyWeights as $dailyWeight) {
                // 種目情報を配列に格納
                $dailyWeightRecords[] = [
                    'weight' => $dailyWeight['weight'],
                    'record_date' => $dailyWeight['record_date'],
                    'body_fat_rate' => $dailyWeight['body_fat_rate'],
                ];
            }
            
            // 元の$dailyWeightsを$dailyWeightRecordsで上書き
            $dailyWeights = $dailyWeightRecords;

            if ($dailyWeights) {
                return ['message' => 'Get successful', 'dailyWeights' => $dailyWeights];
            } else {
                return ['message' => 'No Data'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Database error: ' . $e->getMessage()];
        }
    }

    /**
     * 体重記録を新規作成するメソッド
     * @return array レスポンスデータ
     */
    public static function createDailyWeight(): array {
        // リクエストボディからJSONを取得
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        
        // 日付が提供されているか確認
        if (!isset($data['recordedDate']) || empty($data['recordedDate'])) {
            http_response_code(400);
            return ['message' => 'Recorded-date is required'];
        }

        // 体重が提供されているか確認
        if (!isset($data['dailyWeight']) || empty($data['dailyWeight'])) {
            http_response_code(400);
            return ['message' => 'Daily-weight is required'];
        }

        // 体脂肪率が提供されているか確認
        if (!isset($data['bodyFatRate']) || empty($data['bodyFatRate'])) {
            http_response_code(400);
            return ['message' => 'Body-fat-rate is required'];
        }
        
        $recordedDate = date('Y-m-d', strtotime($data['recordedDate']));
        $dailyWeight = $data['dailyWeight'];
        $bodyFatRate = $data['bodyFatRate'];
        $userId = 1;
        
        try {
            $pdo = self::getDbConnection();
            
            // 同じ日付の体重記録が既に存在するか確認
            $checkStmt = $pdo->prepare('SELECT COUNT(*) FROM daily_weights WHERE record_date = :record_date');
            $checkStmt->bindParam(':record_date', $recordedDate, PDO::PARAM_STR);
            $checkStmt->execute();
            
            if ($checkStmt->fetchColumn() > 0) {
                http_response_code(409); // Conflict
                return ['message' => 'Muscle group with this name already exists'];
            }
            
            // 新しい体重記録を挿入
            $insertStmt = $pdo->prepare('INSERT INTO daily_weights (record_date, weight, body_fat_rate, user_id) VALUES (:record_date, :weight, :body_fat_rate, :user_id)');
            $insertStmt->bindParam(':record_date', $recordedDate, PDO::PARAM_STR);
            $insertStmt->bindParam(':weight', $dailyWeight, PDO::PARAM_STR);
            $insertStmt->bindParam(':body_fat_rate', $bodyFatRate, PDO::PARAM_STR);
            $insertStmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $insertStmt->execute();
            
            return ['message' => 'Create successful', 'id' => $pdo->lastInsertId()];
        } catch (PDOException $e) {
            http_response_code(500);
            return ['message' => 'Database error: ' . $e->getMessage()];
        }
    }
}
