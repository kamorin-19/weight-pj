var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
const handleLoginClick = () => __awaiter(void 0, void 0, void 0, function* () {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    if (!usernameInput || !passwordInput)
        return;
    const username = usernameInput.value;
    const password = passwordInput.value;
    try {
        // 修正: エンドポイントを LoginController.php に変更（api フォルダ内）
        const response = yield axios.post('http://localhost:8089/api/LoginController/login', { username, password }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        console.log('Response:', response.data);
    }
    catch (error) {
        console.error('Error:', error);
    }
});
// DOMが読み込まれてからイベントリスナーを追加する
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    if (!loginButton) {
        console.error("loginButton が見つかりません");
        return;
    }
    loginButton.addEventListener('click', handleLoginClick);
});
