import { initializeHeader } from '../components/header.js';
import { initializeFooter } from '../components/footer.js';
import axios from "axios";

// ページ読み込み時にヘッダーとフッターを描画
document.addEventListener('DOMContentLoaded', () => {
    // ヘッダー描画
    showHeader();
    // データ取得して、表示完了後にボタン描画
    fetchMuscleGroups().then(() => {
        // 処理を行わない
    }).catch(error => {
        console.error('Error fetching muscle groups:', error);
    }).then(() => {
        // フッター描画
        showFooter();
    });
});

// イベントリスナーの追加を別関数として切り出し
const addCreateButtonListener = () => {
    document.getElementById('create-button')?.addEventListener('click', () => {
        // ダイアログを表示
        const dialog = document.createElement('dialog');
        dialog.id = 'create-muscle-group-dialog';
        dialog.innerHTML = `
            <h3>部位の新規作成</h3>
            <form method="dialog">
                <div>
                    <label for="muscle-group-name">部位名:</label>
                    <input type="text" id="muscle-group-name" name="muscle-group-name" required>
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
            const muscleGroupNameOrg = document.getElementById('muscle-group-name') as HTMLInputElement;
            const muscleGroupName = muscleGroupNameOrg.value.trim();
            if (!muscleGroupName) {
                alert('部位名を入力してください');
                return;
            }
            
            try {
                const response = await axios.post('http://localhost:8089/api/MuscleGroup/MuscleGroupsController/createMuscleGroup', 
                    { muscleGroupName },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }
                );
                
                if (response.data.message === 'Create successful') {
                    // 登録したデータを含めて新しいデータを取得
                    const updatedResponse = await axios.post('http://localhost:8089/api/MuscleGroup/MuscleGroupsController/fetchMuscleGroups',
                        { },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            }
                        }
                    );
                    
                    renderMuscleGroupsTable(updatedResponse.data);
                    alert('部位を登録しました');
                    dialog.close();
                    dialog.remove();
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
};

/**
 * ページのヘッダーを初期化して表示する
 * 
 * 「部位マスタ」というタイトルを持つヘッダーを生成し、
 * 'app' IDを持つ要素の直前に挿入します。
 * 
 * @returns {void} この関数は戻り値を持ちません
 * 
 * @requires initializeHeader 関数が定義されていること
 * @requires 'app' IDを持つDOM要素が存在すること
 * 
 * @example
 * // ページロード時やナビゲーション後に呼び出す
 * showHeader();
 */
const showHeader = () => {
    // ヘッダーを描画
    const headerHTML = initializeHeader('部位マスタ');
    const appDiv = document.getElementById('app');
    if (appDiv) {
        appDiv.insertAdjacentHTML('beforeend', headerHTML);
    }
}

/**
 * ページのフッターを初期化して表示する
 * 
 * フッターを生成し、'app' IDを持つ要素の直後に挿入します。
 * 
 * @returns {void} この関数は戻り値を持ちません
 * 
 * @requires initializeFooter 関数が定義されていること
 * @requires 'app' IDを持つDOM要素が存在すること
 * 
 * @example
 * // ページロード時やナビゲーション後に呼び出す
 * showFooter();
 */
const showFooter = () => {
    // フッターを描画
    const footerHTML = initializeFooter();
    const appDiv = document.getElementById('app');
    if (appDiv) {
        appDiv.insertAdjacentHTML('beforeend', footerHTML);
    }
}

// テーブル描画用の関数を分離
const renderMuscleGroupsTable = (muscleGroups: any) => {
    // 既存のテーブルがあれば削除
    const existingTable = document.querySelector('#muscle-groups-table');
    if (existingTable) {
        existingTable.remove();
    }

    // 既存のボタンを一時的に削除
    const existingButton = document.querySelector('.button-container');
    if (existingButton) {
        existingButton.remove();
    }

    const tableHTML = `
        <div id="muscle-groups-table">
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
        </div>
    `;
    
    const appDiv = document.getElementById('app');
    if (appDiv) {
        appDiv.insertAdjacentHTML('beforeend', tableHTML);
        // テーブル描画後に新規作成ボタンを再描画
        showButton();
        // ボタンのイベントリスナーを再設定
        addCreateButtonListener();
    }
};

/**
 * 部位マスタを取得する
 * 
 * 部位マスタを取得するAPIを呼び出し、レスポンスデータを取得します。
 * 
 * @returns {void} この関数は戻り値を持ちません
*/
const fetchMuscleGroups = async (): Promise<void> => {
    try {
        const response = await axios.post('http://localhost:8089/api/MuscleGroup/MuscleGroupsController/fetchMuscleGroups', 
            { },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );
        renderMuscleGroupsTable(response.data);
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * 新規作成ボタンを描画する
 * 
 * 新規作成ボタンを生成し、'app' IDを持つ要素の直後に挿入します。
 * 
 * @returns {void} この関数は戻り値を持ちません
 * 
 * @requires 'app' IDを持つDOM要素が存在すること
 * 
 * @example
 * // ページロード時やナビゲーション後に呼び出す
 * showButton();
 */
const showButton = () => {
    // 新規作成ボタンを描画
    const buttonHTML = `
        <div class="button-container">
            <button id="create-button">新規作成</button>
        </div>
    `;
    const appDiv = document.getElementById('app');
    if (appDiv) {
        appDiv.insertAdjacentHTML('beforeend', buttonHTML);
    }
}


