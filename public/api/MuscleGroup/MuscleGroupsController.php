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

class MuscleGroupsController {

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
     * 部位マスタを取得するメソッド
     * @return array レスポンスデータ
     */
    public static function fetchMuscleGroups(): array {

        try {
            $pdo = self::getDbConnection();
            $stmt = $pdo->prepare('SELECT * FROM muscle_groups');
            $stmt->execute();
            $muscleGroups = $stmt->fetchAll();

            // 部位名を格納する配列を初期化
            $muscleGroupNames = [];
            
            // 各部位の名前を配列に格納
            foreach ($muscleGroups as $muscleGroup) {
                if (isset($muscleGroup['name'])) {
                    $muscleGroupNames[] = [
                        'id' => $muscleGroup['id'],
                        'name' => $muscleGroup['name']
                    ];
                }
            }
            
            // 元の$muscleGroupsを$muscleGroupNamesで上書き
            $muscleGroups = $muscleGroupNames;

            if ($muscleGroups) {
                return ['message' => 'Get successful', 'name' => $muscleGroups];
            } else {
                return ['message' => 'No Data'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Database error: ' . $e->getMessage()];
        }
    }

    /**
     * 部位マスタを新規作成するメソッド
     * @return array レスポンスデータ
     */
    public static function createMuscleGroup(): array {
        // リクエストボディからJSONを取得
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        
        // 部位名が提供されているか確認
        if (!isset($data['muscleGroupName']) || empty($data['muscleGroupName'])) {
            http_response_code(400);
            return ['message' => 'Name is required'];
        }
        
        $name = $data['muscleGroupName'];
        
        try {
            $pdo = self::getDbConnection();
            
            // 同じ名前の部位が既に存在するか確認
            $checkStmt = $pdo->prepare('SELECT COUNT(*) FROM muscle_groups WHERE name = :name');
            $checkStmt->bindParam(':name', $name, PDO::PARAM_STR);
            $checkStmt->execute();
            
            if ($checkStmt->fetchColumn() > 0) {
                http_response_code(409); // Conflict
                return ['message' => 'Muscle group with this name already exists'];
            }
            
            // 新しい部位を挿入
            $insertStmt = $pdo->prepare('INSERT INTO muscle_groups (name) VALUES (:name)');
            $insertStmt->bindParam(':name', $name, PDO::PARAM_STR);
            $insertStmt->execute();
            
            return ['message' => 'Create successful', 'id' => $pdo->lastInsertId()];
        } catch (PDOException $e) {
            http_response_code(500);
            return ['message' => 'Database error: ' . $e->getMessage()];
        }
    }
}
