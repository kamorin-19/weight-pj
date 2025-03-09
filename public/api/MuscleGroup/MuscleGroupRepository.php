<?php

namespace Api\MuscleGroup;
use IRepository\IRepository;   
use PDO;
use PDOException;
use Exception;

/**
 * 部位マスタのデータアクセスを担当するリポジトリクラス
 * 
 * このクラスは、部位マスタテーブルに対するCRUD操作を実装します。
 */
class MuscleGroupRepository implements IRepository
{
    private PDO $pdo;
    
    /**
     * コンストラクタ
     * 
     * データベース接続を初期化します。
     */
    public function __construct()
    {
        $host = 'mysql';  // Docker compose のサービス名
        $dbname = 'weight_admin';
        $username = 'user';
        $password = 'userpassword';

        try {
            $this->pdo = new PDO(
                "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
                $username,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
        } catch (PDOException $e) {
            throw new Exception('Database connection failed: ' . $e->getMessage());
        }
    }
    
    /**
     * 指定されたIDの部位を取得する
     * 
     * @param int $id 取得する部位のID
     * @return array|null 見つかった部位の配列、または見つからない場合はnull
     */
    public function findById(int $id): ?array
    {
        try {
            $stmt = $this->pdo->prepare('SELECT * FROM muscle_groups WHERE id = :id');
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            $result = $stmt->fetch();
            return $result ?: null;
        } catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }
    
    /**
     * すべての部位を取得する
     * 
     * @return array 部位の配列
     */
    public function findAll(): array
    {
        try {
            $stmt = $this->pdo->prepare('SELECT * FROM muscle_groups');
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }
    
    /**
     * 新しい部位を作成する
     * 
     * @param array $data 作成する部位のデータ
     * @return int|bool 成功した場合は新しい部位のID、失敗した場合はfalse
     */
    public function create(array $data): int|bool
    {
        try {
            // 同じ名前の部位が既に存在するか確認
            if (isset($data['name'])) {
                $checkStmt = $this->pdo->prepare('SELECT COUNT(*) FROM muscle_groups WHERE name = :name');
                $checkStmt->bindParam(':name', $data['name'], PDO::PARAM_STR);
                $checkStmt->execute();
                
                if ($checkStmt->fetchColumn() > 0) {
                    return false; // 既に存在する場合はfalseを返す
                }
            }
            
            $stmt = $this->pdo->prepare('INSERT INTO muscle_groups (name) VALUES (:name)');
            $stmt->bindParam(':name', $data['name'], PDO::PARAM_STR);
            $result = $stmt->execute();
            
            if ($result) {
                return (int)$this->pdo->lastInsertId();
            }
            return false;
        } catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }
    
    /**
     * 既存の部位を更新する
     * 
     * @param int $id 更新する部位のID
     * @param array $data 更新するデータ
     * @return bool 更新が成功したかどうか
     */
    public function update(int $id, array $data): bool
    {
        try {
            // 同じ名前の部位が既に存在するか確認（自分自身は除く）
            if (isset($data['name'])) {
                $checkStmt = $this->pdo->prepare('SELECT COUNT(*) FROM muscle_groups WHERE name = :name AND id != :id');
                $checkStmt->bindParam(':name', $data['name'], PDO::PARAM_STR);
                $checkStmt->bindParam(':id', $id, PDO::PARAM_INT);
                $checkStmt->execute();
                
                if ($checkStmt->fetchColumn() > 0) {
                    return false; // 既に存在する場合はfalseを返す
                }
            }
            
            $stmt = $this->pdo->prepare('UPDATE muscle_groups SET name = :name WHERE id = :id');
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':name', $data['name'], PDO::PARAM_STR);
            return $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }
}
