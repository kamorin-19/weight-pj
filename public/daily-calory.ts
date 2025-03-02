import { initializeHeader } from './header.js';
import { initializeFooter } from './footer.js';
import axios from "axios";

// ページ読み込み時にヘッダーとフッターを描画
document.addEventListener('DOMContentLoaded', () => {
    // ヘッダー描画
    showHeader();
    // フッター描画
    showFooter();
    // データ取得
    getDailyCalories();
    // ボタン描画
    showButton();
    
    // 新規作成ボタンにクリックイベントを追加
    document.getElementById('create-button')?.addEventListener('click', async () => {
        // ダイアログを表示
        // ダイアログを表示する関数を呼び出し
        const dialog = document.createElement('dialog');
        dialog.id = 'create-calory-dialog';
        dialog.innerHTML = `
            <h3>カロリー記録の作成</h3>
            <form method="dialog">
                <div>
                    <label for="recorded-date">日付:</label>
                    <input type="text" id="recorded-date" name="recorded-date" required>
                </div>
                <div>
                    <label for="calory">カロリー:</label>
                    <input type="number" id="calory" name="calory" required>
                </div>
                <div>
                    <button type="button" id="register-button">保存</button>
                    <button type="button" id="cancel-button">キャンセル</button>
                </div>
            </form>
        `;
        
        document.body.appendChild(dialog);
        
        // キャンセルボタンのイベントリスナーを追加
        dialog.querySelector('#cancel-button')?.addEventListener('click', () => {
            dialog.close();
            dialog.remove();
        });

        // 保存ボタンのイベントリスナーを追加
        dialog.querySelector('#register-button')?.addEventListener('click', async () => {
            // 入力値を取得
            const recordedDateInput = document.getElementById('recorded-date') as HTMLInputElement;
            const recordedDate = recordedDateInput.value.trim();
            const dailyCaloryInput = document.getElementById('calory') as HTMLInputElement;
            const dailyCalory = dailyCaloryInput.value.trim();

            try {
                // APIを呼び出して部位を登録
                const response = await axios.post('http://localhost:8089/api/DailyCaloryController/createDailyCalory', 
                    { recordedDate, dailyCalory },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }
                );
                
                // 登録成功時の処理
                if (response.data.message === 'Create successful') {
                    alert('カロリーを登録しました');
                    dialog.close();
                    dialog.remove();
                    
                    // データを再取得して表示を更新
                    getDailyCalories();
                    
                } else {
                    alert('登録に失敗しました: ' + response.data.message);
                }
            } catch (error) {
                console.error('エラーが発生しました:', error);
                alert('登録処理中にエラーが発生しました');
            }
        });
        // ダイアログを表示
        dialog.showModal();
    });
});

const showHeader = () => {
    // ヘッダーを描画
    const headerHTML = initializeHeader('カロリー記録');
    const dailyCaloryDiv = document.getElementById('daily-calory');
    if (dailyCaloryDiv) {
        dailyCaloryDiv.insertAdjacentHTML('beforeend', headerHTML);
    }
}

const showFooter = () => {
    // フッターを描画
    const footerHTML = initializeFooter();
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

const showButton = () => {
    // 新規作成ボタンを描画
    const buttonHTML = `
        <div class="button-container">
            <button id="create-button">新規作成</button>
        </div>
    `;
    const dailyCaloryDiv = document.getElementById('daily-calory');
    if (dailyCaloryDiv) {
        dailyCaloryDiv.insertAdjacentHTML('beforeend', buttonHTML);
    }
}

const getDailyCalories = async (): Promise<void> => {
    // カロリー記録を取得
    try {
        // Todo: メソッド名は要件等で変更する
        const response = await axios.post('http://localhost:8089/api/DailyCaloryController/getDailyCalories', 
            { },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );
        // レスポンスデータを取得
        const dailyCalories = response.data;
        // テーブルを作成
        const tableHTML = `
            <h2>カロリー記録</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>日付</th>
                        <th>カロリー</th>
                    </tr>
                    </tr>
                </thead>
                <tbody>
                    ${dailyCalories && dailyCalories.dailyCalories ? 
                        dailyCalories.dailyCalories.map((dailyCalory: any) => `
                        <tr>
                            <td>${dailyCalory.record_date}</td>
                            <td>${dailyCalory.calory}</td>
                        </tr>`).join('')
                    : ''}
                </tbody>
            </table>
        `;
        
        // テーブルをDOMに追加
        const dailyCaloryDiv = document.getElementById('daily-calory');
        if (dailyCaloryDiv) {
            dailyCaloryDiv.insertAdjacentHTML('beforeend', tableHTML);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

