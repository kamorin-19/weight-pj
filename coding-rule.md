# コーディング規約

## 目次
1. [全般的なルール](#全般的なルール)
2. [HTML](#html)
3. [CSS](#css)
4. [TypeScript](#typescript)
5. [PHP](#php)

## 全般的なルール

### ファイル形式
- 文字エンコーディングは UTF-8 を使用する
- 改行コードは LF (Unix スタイル) を使用する
- ファイル末尾には空行を1行入れる

### インデント・スペース
- インデントはスペース 2 文字または 4 文字で統一する（プロジェクト全体で一貫させる）
- タブ文字は使用しない

### 命名規則
- ファイル名はプロジェクト全体で一貫した命名規則を使用する
- クラス名、関数名、変数名は意味のある名前をつける

### コメント
- コードの複雑な部分や重要な決定については必ずコメントを入れる
- TODO、FIXME などの標準的なマーカーを使用する

### コミット
- コミットメッセージは明確で簡潔に記述する
- 関連する Issue がある場合は参照する

## HTML

### 文書構造
- DOCTYPE 宣言を必ず記述する: `<!DOCTYPE html>`
- 言語属性を指定する: `<html lang="ja">`
- meta 要素で viewport を設定する
- 適切な HTML5 セマンティック要素を使用する (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` など)

### コーディングスタイル
- タグ名、属性名はすべて小文字で記述する
- 属性値は二重引用符（"）で囲む
- 閉じタグが任意の要素でも閉じタグを記述する
- 空要素のタグは XML 形式で閉じない (`<br>` を使用し、`<br />` は使用しない)
- ID 名はキャメルケースまたはケバブケース（ハイフン区切り）で統一する
- ファイル名はケバブケース（ハイフン区切り）で統一する(sample-file.html)

```html
<!-- 良い例 -->
<div id="mainContent" class="content-area">
  <h1>タイトル</h1>
  <img src="image.jpg" alt="説明">
  <br>
</div>

<!-- 悪い例 -->
<DIV ID='main_content' CLASS="content_area">
  <H1>タイトル</H1>
  <img src='image.jpg' alt='説明' />
  <br/>
</DIV>
```

### アクセシビリティ
- 画像には適切な alt 属性を追加する
- フォーム要素には label 要素を関連付ける
- aria 属性を適切に使用する
- 見出し要素（h1-h6）は正しい階層で使用する

## CSS

### ファイル構成
- リセット CSS または Normalize.css を使用する
- 大規模なプロジェクトでは CSS をモジュール化する

### コーディングスタイル
- セレクタと波括弧の間にスペースを入れる
- プロパティと値の間にスペースを入れる
- セミコロンは省略せず全てのプロパティの後につける
- 複数のセレクタがある場合は、セレクタごとに改行する
- カラーコードは可能な限り短縮形を使用する（#fff など）
- プロパティはアルファベット順、または論理的なグループごとに整理する

```css
/* 良い例 */
.selector1,
.selector2 {
  display: block;
  margin: 0;
  color: #fff;
}

/* 悪い例 */
.selector1, .selector2{display:block; margin:0;color:#ffffff}
```

### 命名規則
- クラス名はケバブケース（ハイフン区切り）を使用する
- ID 名はキャメルケースまたはケバブケースを使用する
- BEM や SMACSS などの命名規則の採用を検討する

### メディアクエリ
- モバイルファーストアプローチを使用する
- ブレークポイントは一貫した値を使用する

## TypeScript

### 基本設定
- TypeScript の strict モードを有効にする
- tsconfig.json で適切なコンパイラオプションを設定する

### 変数宣言
- `var` は使用せず、`const` または `let` を使用する
- 再代入が不要な変数は `const` を使用する

```typescript
// 良い例
const MAX_COUNT = 10;
let currentCount = 0;

// 悪い例
var maxCount = 10;
var currentCount = 0;
```

### 型定義
- 可能な限り明示的に型を定義する
- interface または type を使用して複雑な型を定義する
- any 型の使用は最小限に抑える

```typescript
// 良い例
interface User {
  id: number;
  name: string;
  email: string;
  active?: boolean;
}

const getUser = (id: number): User => {
  // ...
};

// 悪い例
const getUser = (id) => {
  // ...
};
```

### 命名規則
- 変数、関数名はキャメルケースを使用する: `userName`
- クラス、interface、type 名はパスカルケースを使用する: `UserProfile`
- 定数は大文字のスネークケースを使用する: `MAX_RETRY_COUNT`

### 関数
- アロー関数を優先して使用する
- 関数の引数と戻り値の型を明示する
- 関数はできるだけ純粋関数として実装する

### モジュール
- ES モジュール形式 (import/export) を使用する
- 名前付きエクスポートを優先して使用する
- ファイルごとに単一の責任を持つモジュールを作成する

### エラー処理
- try/catch を適切に使用する
- エラーオブジェクトは型付きで扱う

## PHP

### ファイル形式
- PHP のみのファイルでは、終了タグ `?>` を省略する
- PHP と HTML が混在するファイルでは、適切にタグを使い分ける

### 命名規則
- クラス名はパスカルケースを使用する: `UserController`
- メソッド名と変数名はキャメルケースを使用する: `getUserById`
- 定数は大文字のスネークケースを使用する: `MAX_LOGIN_ATTEMPTS`
- クラスのプロパティにはアクセス修飾子を明示する（`public`, `protected`, `private`）

```php
// 良い例
class UserController
{
    private $maxLoginAttempts = 5;
    
    public function getUserById($id)
    {
        // ...
    }
}

// 悪い例
class user_controller
{
    var $max_login_attempts = 5;
    
    function get_user_by_id($id)
    {
        // ...
    }
}
```

### コーディングスタイル
- 波括弧は新しい行に置く（Allman スタイル）または同じ行に置く（K&R スタイル）のどちらかで統一する
- 波括弧は常に使用し、省略しない（if 文が1行でも）
- 制御構造キーワードの後にスペースを入れる
- 演算子の前後にスペースを入れる
- カンマの後にスペースを入れる

```php
// Allman スタイル
if ($condition)
{
    doSomething();
}
else
{
    doSomethingElse();
}

// K&R スタイル
if ($condition) {
    doSomething();
} else {
    doSomethingElse();
}
```

### エラー処理
- 例外を適切に使用する
- try/catch ブロックを使用してエラーを捕捉する
- エラーログを適切に記録する

### セキュリティ
- ユーザー入力は常にバリデーションとサニタイズを行う
- SQL インジェクション対策として、プリペアドステートメントを使用する
- CSRF 対策を実装する
- XSS 対策として、出力時にはエスケープを行う

```php
// 良い例 - プリペアドステートメント
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$userId]);

// 悪い例 - SQL インジェクションの危険性
$query = "SELECT * FROM users WHERE id = " . $_GET['id'];
```

### データベース操作
- データベース接続情報は設定ファイルに分離する
- トランザクションを適切に使用する
- クエリの最適化を常に意識する

### API 設計（RESTful API の場合）
- HTTPメソッドを適切に使用する（GET, POST, PUT, DELETE など）
- レスポンスは一貫した形式で返す（JSON推奨）
- エラーコードと詳細なエラーメッセージを提供する

### パフォーマンス
- 不要なグローバル変数の使用を避ける
- ループ内での重い処理を避ける
- キャッシュ機構を活用する
- 適切なログレベルを設定する