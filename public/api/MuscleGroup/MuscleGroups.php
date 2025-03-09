<?php

namespace Api\MuscleGroup;

/**
 * 部位マスタのドメインオブジェクトクラス
 * 
 * このクラスは、部位マスタの構造を表現します。
 */
class MuscleGroups
{
    /**
     * 部位ID
     *
     * @var int
     */
    private int $id;

    /**
     * 部位名
     *
     * @var string
     */
    private string $name;

    /**
     * コンストラクタ
     *
     * @param int $id 部位ID
     * @param string $name 部位名
     */
    public function __construct(int $id, string $name)
    {
        $this->id = $id;
        $this->name = $name;
    }

    /**
     * 部位IDを取得する
     *
     * @return int 部位ID
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * 部位名を取得する
     *
     * @return string 部位名
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * 配列に変換する
     *
     * @return array 部位の配列表現
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name
        ];
    }

    /**
     * 配列からオブジェクトを作成する
     *
     * @param array $data 部位データの配列
     * @return self 新しいMuscleGroupsインスタンス
     */
    public static function fromArray(array $data): self
    {
        return new self(
            $data['id'] ?? 0,
            $data['name'] ?? ''
        );
    }
}
