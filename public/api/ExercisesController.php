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

class ExercisesController {

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
     * 種目マスタを取得するメソッド
     * @return array レスポンスデータ
     */
    public static function getExercises(): array {

        try {
            $pdo = self::getDbConnection();
            $stmt = $pdo->prepare('SELECT * FROM exercises LEFT JOIN muscle_groups ON exercises.muscle_group_id = muscle_groups.id');
            $stmt->execute();
            $exercises = $stmt->fetchAll();

            // 部位名を格納する配列を初期化
            $exerciseNames = [];
            
            // 各部位の名前を配列に格納
            foreach ($exercises as $exercise) {
                if (isset($exercise['name'])) {
                    // 種目情報を配列に格納
                    $exerciseNames[] = [
                        'name' => $exercise['name'],
                        'ponderation' => $exercise['ponderation'],
                        'muscle_group_id' => $exercise['muscle_group_id'],
                        'muscle_group_name' => $exercise['muscle_groups.name'] ?? null
                    ];
                }
            }
            
            // 元の$muscleGroupsを$muscleGroupNamesで上書き
            $exercises = $exerciseNames;

            if ($exercises) {
                return ['message' => 'Get successful', 'exercises' => $exercises];
            } else {
                return ['message' => 'No Data'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Database error: ' . $e->getMessage()];
        }
    }

    /**
     * 種目マスタを新規作成するメソッド
     * @return array レスポンスデータ
     */
    public static function createExercise(): array {
        // リクエストボディからJSONを取得
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        
        // 種目名が提供されているか確認
        if (!isset($data['name']) || empty($data['name'])) {
            http_response_code(400);
            return ['message' => 'Name is required'];
        }

        // 重みが提供されているか確認
        if (!isset($data['ponderation']) || empty($data['ponderation'])) {
            http_response_code(400);
            return ['message' => 'Ponderation is required'];
        }

        // 部位IDが提供されているか確認
        if (!isset($data['muscleGroupId']) || empty($data['muscleGroupId'])) {
            http_response_code(400);
            return ['message' => 'Muscle group ID is required'];
        }
        
        $name = $data['name'];
        $ponderation = $data['ponderation'];
        $muscleGroupId = $data['muscleGroupId'];
        
        try {
            $pdo = self::getDbConnection();
            
            // 同じ名前の種目が既に存在するか確認
            $checkStmt = $pdo->prepare('SELECT COUNT(*) FROM exercises WHERE name = :name');
            $checkStmt->bindParam(':name', $name, PDO::PARAM_STR);
            $checkStmt->execute();
            
            if ($checkStmt->fetchColumn() > 0) {
                http_response_code(409); // Conflict
                return ['message' => 'Muscle group with this name already exists'];
            }
            
            // 新しい種目を挿入
            $insertStmt = $pdo->prepare('INSERT INTO exercises (name, ponderation, muscle_group_id) VALUES (:name, :ponderation, :muscle_group_id)');
            $insertStmt->bindParam(':name', $name, PDO::PARAM_STR);
            $insertStmt->bindParam(':ponderation', $ponderation, PDO::PARAM_INT);
            $insertStmt->bindParam(':muscle_group_id', $muscleGroupId, PDO::PARAM_INT);
            $insertStmt->execute();
            
            return ['message' => 'Create successful', 'id' => $pdo->lastInsertId()];
        } catch (PDOException $e) {
            http_response_code(500);
            return ['message' => 'Database error: ' . $e->getMessage()];
        }
    }
}
