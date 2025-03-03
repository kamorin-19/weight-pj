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
    // フッター描画
    showFooter();
    // データ取得
    getDailyWorkouts();
    // ボタン描画
    showButton();
    // 新規作成ボタンにクリックイベントを追加
    (_a = document.getElementById('create-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const response = yield axios.post('http://localhost:8089/api/ExercisesController/getExercises', {}, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        // レスポンスデータを取得
        const exercises = response.data;
        // ダイアログを表示
        // ダイアログを表示する関数を呼び出し
        const dialog = document.createElement('dialog');
        dialog.id = 'create-workout-dialog';
        dialog.innerHTML = `
            <h3>筋トレ記録の作成</h3>
            <form method="dialog">
                <div>
                    <label for="recorded-date">日付:</label>
                    <input type="text" id="recorded-date" name="recorded-date" required>
                </div>
                <div>
                    <label for="exercise">種目:</label>
                    <select id="exercise" name="exercise" required>
                        <option value="">種目を選択してください</option>
                        ${exercises && exercises.exercises ?
            exercises.exercises.map((name) => `<option value="${name.id}">${name.name}</option>`).join('')
            : ''}
                    </select>
                </div>
                <div>
                    <label for="weight">重量:</label>
                    <input type="number" id="weight" name="weight" required>
                </div>
                <div>
                    <label for="first-time">1回目:</label>
                    <input type="number" id="first-time" name="first-time" required>
                </div>
                <div>
                    <label for="second-time">2回目:</label>
                    <input type="number" id="second-time" name="second-time" required>
                </div>
                <div>
                    <label for="third-time">3回目:</label>
                    <input type="number" id="third-time" name="third-time" required>
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
            const recordedDateInput = document.getElementById('recorded-date');
            const recordedDate = recordedDateInput.value.trim();
            const exerciseInput = document.getElementById('exercise');
            const exercise = exerciseInput.value.trim();
            const weightInput = document.getElementById('weight');
            const weight = weightInput.value.trim();
            const firstTimeInput = document.getElementById('first-time');
            const firstTime = firstTimeInput.value.trim();
            const secondTimeInput = document.getElementById('second-time');
            const secondTime = secondTimeInput.value.trim();
            const thirdTimeInput = document.getElementById('third-time');
            const thirdTime = thirdTimeInput.value.trim();
            try {
                // APIを呼び出して部位を登録
                const response = yield axios.post('http://localhost:8089/api/DailyWorkoutController/createDailyWorkout', { recordedDate, exercise, weight, firstTime, secondTime, thirdTime }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                // 登録成功時の処理
                if (response.data.message === 'Create successful') {
                    alert('筋トレを登録しました');
                    dialog.close();
                    dialog.remove();
                    // データを再取得して表示を更新
                    getDailyWorkouts();
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
    const headerHTML = initializeHeader('筋トレ記録');
    const dailyWorkoutDiv = document.getElementById('daily-workout');
    if (dailyWorkoutDiv) {
        dailyWorkoutDiv.insertAdjacentHTML('beforeend', headerHTML);
    }
};
const showFooter = () => {
    // フッターを描画
    const footerHTML = initializeFooter();
    document.body.insertAdjacentHTML('beforeend', footerHTML);
};
const showButton = () => {
    // 新規作成ボタンを描画
    const buttonHTML = `
        <div class="button-container">
            <button id="create-button">新規作成</button>
        </div>
    `;
    const dailyWorkoutDiv = document.getElementById('daily-workout');
    if (dailyWorkoutDiv) {
        dailyWorkoutDiv.insertAdjacentHTML('beforeend', buttonHTML);
    }
};
const getDailyWorkouts = () => __awaiter(void 0, void 0, void 0, function* () {
    // 種目マスタを取得
    try {
        // Todo: メソッド名は要件等
        const response = yield axios.post('http://localhost:8089/api/DailyWorkoutController/getDailyWorkouts', {}, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        // レスポンスデータを取得
        const dailyWorkouts = response.data;
        // テーブルを作成
        const tableHTML = `
            <h2>筋トレ記録</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>日付</th>
                        <th>種目</th>
                        <th>重量</th>
                        <th>1回目</th>
                        <th>2回目</th>
                        <th>3回目</th>
                    </tr>
                </thead>
                <tbody>
                    ${dailyWorkouts && dailyWorkouts.dailyWorkouts ?
            dailyWorkouts.dailyWorkouts.map((dailyWorkout) => `
                        <tr>
                            <td>${dailyWorkout.record_date}</td>
                            <td>${dailyWorkout.exercise_id}</td>
                            <td>${dailyWorkout.set_weight}</td>
                            <td>${dailyWorkout.first_rep}</td>
                            <td>${dailyWorkout.second_rep}</td>
                            <td>${dailyWorkout.third_rep}</td>
                        </tr>`).join('')
            : ''}
                </tbody>
            </table>
        `;
        // テーブルをDOMに追加
        const dailyWorkoutDiv = document.getElementById('daily-workout');
        if (dailyWorkoutDiv) {
            dailyWorkoutDiv.insertAdjacentHTML('beforeend', tableHTML);
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
});
