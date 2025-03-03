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

class DailyWorkoutController {

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
     * 筋トレ記録を取得するメソッド
     * @return array レスポンスデータ
     */
    public static function getDailyWorkouts(): array {

        try {
            $pdo = self::getDbConnection();
            $stmt = $pdo->prepare('SELECT * FROM daily_workouts ORDER BY record_date DESC, exercise_id');
            $stmt->execute();
            $dailyWorkouts = $stmt->fetchAll();

            // 筋トレ記録を格納する配列を初期化
            $dailyWorkoutRecords = [];
            
            // 各部位の名前を配列に格納
            foreach ($dailyWorkouts as $dailyWorkout) {
                // 種目情報を配列に格納
                $dailyWorkoutRecords[] = [
                    'record_date' => $dailyWorkout['record_date'],
                    'exercise_id' => $dailyWorkout['exercise_id'],
                    'set_weight' => $dailyWorkout['set_weight'],
                    'first_rep' => $dailyWorkout['first_rep'],
                    'second_rep' => $dailyWorkout['second_rep'],
                    'third_rep' => $dailyWorkout['third_rep'],
                ];
            }
            
            // 元の$dailyWorkoutsを$dailyWorkoutRecordsで上書き
            $dailyWorkouts = $dailyWorkoutRecords;

            if ($dailyWorkouts) {
                return ['message' => 'Get successful', 'dailyWorkouts' => $dailyWorkouts];
            } else {
                return ['message' => 'No Data'];
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => 'Database error: ' . $e->getMessage()];
        }
    }

    /**
     * 筋トレ記録を新規作成するメソッド
     * @return array レスポンスデータ
     */
    public static function createDailyWorkout(): array {
        // リクエストボディからJSONを取得
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        
        // 日付が提供されているか確認
        if (!isset($data['recordedDate']) || empty($data['recordedDate'])) {
            http_response_code(400);
            return ['message' => 'Recorded-date is required'];
        }

        // 筋トレ種目が提供されているか確認
        if (!isset($data['exercise']) || empty($data['exercise'])) {
            http_response_code(400);
            return ['message' => 'Exercise is required'];
        }

        // 重量が提供されているか確認
        if (!isset($data['weight']) || empty($data['weight'])) {
            http_response_code(400);
            return ['message' => 'Weight is required'];
        }

        // 1回目のトレーニング回数が提供されているか確認
        if (!isset($data['firstTime']) || empty($data['firstTime'])) {
            http_response_code(400);
            return ['message' => 'First-time is required'];
        }
        
        // 2回目のトレーニング回数が提供されているか確認
        if (!isset($data['secondTime']) || empty($data['secondTime'])) {
            http_response_code(400);
            return ['message' => 'Second-time is required'];
        }

        // 3回目のトレーニング回数が提供されているか確認
        if (!isset($data['thirdTime']) || empty($data['thirdTime'])) {
            http_response_code(400);
            return ['message' => 'Third-time is required'];
        }
        
        $recordedDate = date('Y-m-d', strtotime($data['recordedDate']));
        //$exercise = $data['exercise'];
        $exercise = 1;
        $weight = $data['weight'];
        $firstTime = $data['firstTime'];
        $secondTime = $data['secondTime'];
        $thirdTime = $data['thirdTime'];
        $userId = 1;
        
        try {
            $pdo = self::getDbConnection();
            
            // 同じ日付の筋トレ記録が既に存在するか確認
            $checkStmt = $pdo->prepare('SELECT COUNT(*) FROM daily_workouts WHERE record_date = :record_date AND exercise_id = :exercise');
            $checkStmt->bindParam(':record_date', $recordedDate, PDO::PARAM_STR);
            $checkStmt->bindParam(':exercise', $exercise, PDO::PARAM_STR);
            $checkStmt->execute();
            
            if ($checkStmt->fetchColumn() > 0) {
                http_response_code(409); // Conflict
                return ['message' => 'Daily workout with this date already exists'];
            }
            
            // 新しい筋トレ記録を挿入
            $insertStmt = $pdo->prepare('INSERT INTO daily_workouts (record_date, exercise_id, set_weight, first_rep, second_rep, third_rep, user_id) VALUES (:record_date, :exercise_id, :set_weight, :first_rep, :second_rep, :third_rep, :user_id)');
            $insertStmt->bindParam(':record_date', $recordedDate, PDO::PARAM_STR);
            $insertStmt->bindParam(':exercise_id', $exercise, PDO::PARAM_STR);
            $insertStmt->bindParam(':set_weight', $weight, PDO::PARAM_STR);
            $insertStmt->bindParam(':first_rep', $firstTime, PDO::PARAM_STR);
            $insertStmt->bindParam(':second_rep', $secondTime, PDO::PARAM_STR);
            $insertStmt->bindParam(':third_rep', $thirdTime, PDO::PARAM_STR);
            $insertStmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $insertStmt->execute();
            
            return ['message' => 'Create successful', 'id' => $pdo->lastInsertId()];
        } catch (PDOException $e) {
            http_response_code(500);
            return ['message' => 'Database error: ' . $e->getMessage()];
        }
    }
}
