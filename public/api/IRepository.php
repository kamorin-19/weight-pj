<?php

namespace IRepository;

/**
 * データアクセスのための基本インターフェース
 * 
 * このインターフェースは、データベースとのやり取りを行うための
 * 基本的なCRUD操作を定義します。
 */
interface IRepository
{
    /**
     * 指定されたIDのエンティティを取得する
     * 
     * @param int $id 取得するエンティティのID
     * @return array|null 見つかったエンティティの配列、または見つからない場合はnull
     */
    public function findById(int $id): ?array;
    
    /**
     * すべてのエンティティを取得する
     * 
     * @return array エンティティの配列
     */
    public function findAll(): array;
    
    /**
     * 新しいエンティティを作成する
     * 
     * @param array $data 作成するエンティティのデータ
     * @return int|bool 成功した場合は新しいエンティティのID、失敗した場合はfalse
     */
    public function create(array $data): int|bool;
    
    /**
     * 既存のエンティティを更新する
     * 
     * @param int $id 更新するエンティティのID
     * @param array $data 更新するデータ
     * @return bool 更新が成功したかどうか
     */
    public function update(int $id, array $data): bool;
}
