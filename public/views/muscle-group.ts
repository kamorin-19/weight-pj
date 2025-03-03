import { initializeHeader } from '../components/header.js';
import { initializeFooter } from '../components/footer.js';
import axios from "axios";

// ページ読み込み時にヘッダーとフッターを描画
document.addEventListener('DOMContentLoaded', () => {
    // ヘッダー描画
    showHeader();
    // フッター描画
    showFooter();
    // データ取得
    getMuscleGroups();
    // ボタン描画
    showButton();
    
    // 新規作成ボタンにクリックイベントを追加
    document.getElementById('create-button')?.addEventListener('click', () => {
        // ダイアログを表示
        // ダイアログを表示する関数を呼び出し
        const dialog = document.createElement('dialog');
        dialog.id = 'create-muscle-group-dialog';
        dialog.innerHTML = `
            <h3>部位の新規作成</h3>
            <form method="dialog">
                <div>
                    <label for="muscle-group-name">部位名:</label>
                    <input type="text" id="muscle-group-name" name="name" required>
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
            const nameInput = document.getElementById('muscle-group-name') as HTMLInputElement;
            const name = nameInput.value.trim();
            
            if (!name) {
                alert('部位名を入力してください');
                return;
            }
            
            try {
                // APIを呼び出して部位を登録
                const response = await axios.post('http://localhost:8089/api/MuscleGroupsController/createMuscleGroup', 
                    { name },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }
                );
                
                // 登録成功時の処理
                if (response.data.message === 'Create successful') {
                    alert('部位を登録しました');
                    dialog.close();
                    dialog.remove();
                    
                    // データを再取得して表示を更新
                    getMuscleGroups();
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
    const headerHTML = initializeHeader('部位マスタ');
    const muscleGroupDiv = document.getElementById('muscle-group');
    if (muscleGroupDiv) {
        muscleGroupDiv.insertAdjacentHTML('beforeend', headerHTML);
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
    const muscleGroupDiv = document.getElementById('muscle-group');
    if (muscleGroupDiv) {
        muscleGroupDiv.insertAdjacentHTML('beforeend', buttonHTML);
    }
}

const getMuscleGroups = async (): Promise<void> => {
    // 部位マスタを取得
    try {
        // Todo: メソッド名は要件等
        const response = await axios.post('http://localhost:8089/api/MuscleGroupsController/getMuscleGroups', 
            { },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );
        // レスポンスデータを取得
        const muscleGroups = response.data;
        
        // テーブルを作成
        const tableHTML = `
            <h2>部位一覧</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>部位名</th>
                    </tr>
                </thead>
                <tbody>
                    ${muscleGroups && muscleGroups.name ? 
                        muscleGroups.name.map((name: { id: number; name: string }) => `
                        <tr>
                            <td>${name.name}</td>
                        </tr>`).join('')
                    : ''}
                </tbody>
            </table>
        `;
        
        // テーブルをDOMに追加
        const muscleGroupDiv = document.getElementById('muscle-group');
        if (muscleGroupDiv) {
            muscleGroupDiv.insertAdjacentHTML('beforeend', tableHTML);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

