var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { initializeHeader } from './header.js';
import { initializeFooter } from './footer.js';
import axios from "axios";
// ページ読み込み時にヘッダーとフッターを描画
document.addEventListener('DOMContentLoaded', () => {
    var _a;
    // ヘッダー描画
    showHeader();
    // ボディー描画
    showBody();
    // フッター描画
    showFooter();
    // ボタン描画
    showButton();
    // 新規作成ボタンにクリックイベントを追加
    (_a = document.getElementById('create-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const response = yield axios.post('http://localhost:8089/api/MuscleGroupsController/getMuscleGroups', {}, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        // レスポンスデータを取得
        const muscleGroups = response.data;
        // ダイアログを表示
        // ダイアログを表示する関数を呼び出し
        const dialog = document.createElement('dialog');
        dialog.id = 'create-exercise-dialog';
        dialog.innerHTML = `
            <h3>種目の新規作成</h3>
            <form method="dialog">
                <div>
                    <label for="exercise-name">種目名:</label>
                    <input type="text" id="exercise-name" name="name" required>
                </div>
                <div>
                    <label for="exercise-ponderation">重み:</label>
                    <input type="number" id="exercise-ponderation" name="ponderation" required>
                </div>
                <div>
                    <label for="exercise-muscle-group">部位:</label>
                    <select id="exercise-muscle-group" name="muscle_group_id" required>
                        <option value="">部位を選択してください</option>
                        ${muscleGroups && muscleGroups.name ?
            muscleGroups.name.map((name) => `<option value="${name.id}">${name.name}</option>`).join('')
            : ''}
                    </select>
                </div>
                <div>
                    <button type="button" id="register-button">保存</button>
                    <button type="button" id="cancel-button">キャンセル</button>
                </div>
            </form>
        `;
        document.body.appendChild(dialog);
        // キャンセルボタンのイベントリスナーを追加
        (_a = dialog.querySelector('#cancel-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            dialog.close();
            dialog.remove();
        });
        // 保存ボタンのイベントリスナーを追加
        (_b = dialog.querySelector('#register-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
            // 入力値を取得
            const nameInput = document.getElementById('exercise-name');
            const name = nameInput.value.trim();
            const ponderationInput = document.getElementById('exercise-ponderation');
            const ponderation = ponderationInput.value.trim();
            const muscleGroupIdInput = document.getElementById('exercise-muscle-group');
            const muscleGroupId = muscleGroupIdInput.value.trim();
            if (!name) {
                alert('種目名を入力してください');
                return;
            }
            if (!ponderation) {
                alert('重みを入力してください');
                return;
            }
            if (!muscleGroupId) {
                alert('部位を選択してください');
                return;
            }
            try {
                // APIを呼び出して部位を登録
                const response = yield axios.post('http://localhost:8089/api/ExercisesController/createExercise', { name, ponderation, muscleGroupId }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                // 登録成功時の処理
                if (response.data.message === 'Create successful') {
                    alert('部位を登録しました');
                    dialog.close();
                    dialog.remove();
                    // データを再取得して表示を更新
                    getExercises();
                }
                else {
                    alert('登録に失敗しました: ' + response.data.message);
                }
            }
            catch (error) {
                console.error('エラーが発生しました:', error);
                alert('登録処理中にエラーが発生しました');
            }
        }));
        // ダイアログを表示
        dialog.showModal();
    }));
});
const showHeader = () => {
    // ヘッダーを描画
    const headerHTML = initializeHeader('CSVインポート');
    const importCsvDiv = document.getElementById('import-csv');
    if (importCsvDiv) {
        importCsvDiv.insertAdjacentHTML('beforeend', headerHTML);
    }
};
const showBody = () => {
    var _a;
    // ボディーを描画
    // CSVインポート用のフォームを描画
    const formHTML = `
        <div class="csv-import-container">
            <h2>CSVファイルのインポート</h2>
            <div class="form-group">
                <label for="csv-file">CSVファイルを選択:</label>
                <input type="file" id="csv-file" accept=".csv" />
            </div>
            <div class="import-instructions">
                <p>※ CSVファイルの形式に注意してください。</p>
                <p>※ 文字コードはUTF-8を推奨します。</p>
            </div>
        </div>
    `;
    const importCsvDiv = document.getElementById('import-csv');
    if (importCsvDiv) {
        importCsvDiv.insertAdjacentHTML('beforeend', formHTML);
    }
    // ファイル選択イベントのリスナーを追加
    (_a = document.getElementById('csv-file')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', (event) => {
        var _a;
        const fileInput = event.target;
        const file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            console.log(`選択されたファイル: ${file.name}`);
            // ファイル情報を表示
            const fileInfoDiv = document.createElement('div');
            fileInfoDiv.className = 'file-info';
            fileInfoDiv.innerHTML = `
                <p>ファイル名: ${file.name}</p>
                <p>サイズ: ${(file.size / 1024).toFixed(2)} KB</p>
                <p>タイプ: ${file.type || 'text/csv'}</p>
            `;
            // 既存の情報があれば削除
            const existingInfo = document.querySelector('.file-info');
            if (existingInfo) {
                existingInfo.remove();
            }
            // 新しい情報を追加
            const container = document.querySelector('.csv-import-container');
            container === null || container === void 0 ? void 0 : container.appendChild(fileInfoDiv);
        }
    });
};
const showFooter = () => {
    // フッターを描画
    const footerHTML = initializeFooter();
    document.body.insertAdjacentHTML('beforeend', footerHTML);
};
const showButton = () => {
    var _a;
    // 新規作成ボタンを描画
    const buttonHTML = `
        <div class="button-container">
            <button id="csv-import">インポート</button>
        </div>
    `;
    const importCsvDiv = document.getElementById('import-csv');
    if (importCsvDiv) {
        importCsvDiv.insertAdjacentHTML('beforeend', buttonHTML);
    }
    // インポートボタンのイベントリスナーを追加
    (_a = document.getElementById('csv-import')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const fileInput = document.getElementById('csv-file');
        const file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
        console.log("★");
        if (!file) {
            alert('CSVファイルを選択してください');
            return;
        }
        // FileReaderでファイルを読み込む
        const reader = new FileReader();
        reader.onload = (e) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const csvContent = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            try {
                // APIを呼び出してCSVをインポート
                const response = yield axios.post('http://localhost:8089/api/ImportCsvController/importCsv', { csvContent }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                if (response.data.success) {
                    alert('CSVのインポートが完了しました');
                }
                else {
                    alert('インポートに失敗しました: ' + response.data.message);
                }
            }
            catch (error) {
                console.error('エラーが発生しました:', error);
                alert('インポート処理中にエラーが発生しました');
            }
        });
        reader.readAsText(file);
    }));
};
const getExercises = () => __awaiter(void 0, void 0, void 0, function* () {
    // 種目マスタを取得
    try {
        // Todo: メソッド名は要件等
        const response = yield axios.post('http://localhost:8089/api/ExercisesController/getExercises', {}, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        // レスポンスデータを取得
        const exercises = response.data;
        console.log("★");
        console.log(exercises);
        console.log(exercises.exercises);
        // テーブルを作成
        const tableHTML = `
            <h2>種目一覧</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>種目名</th>
                        <th>重み</th>
                        <th>部位</th>
                    </tr>
                </thead>
                <tbody>
                    ${exercises && exercises.exercises ?
            exercises.exercises.map((name, ponderation, muscle_group_name) => `
                        <tr>
                            <td>${name}</td>
                            <td>${ponderation}</td>
                            <td>${muscle_group_name}</td>
                        </tr>`).join('')
            : ''}
                </tbody>
            </table>
        `;
        // テーブルをDOMに追加
        const exercisesDiv = document.getElementById('exercises');
        if (exercisesDiv) {
            exercisesDiv.insertAdjacentHTML('beforeend', tableHTML);
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
});
