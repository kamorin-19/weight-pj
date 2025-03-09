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
const twoFactorButtonClick = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 修正: エンドポイントを LoginController.php に変更（api フォルダ内）
        const response = yield axios.post('http://localhost:8089/api/Base/TwoFactorAuthenticationController/Authentication', {}, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if (response.data.message === 'Login successful') {
            window.location.href = './views/menu.html';
        }
        else {
            console.log('Response:', response.data);
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
});
// DOMが読み込まれてからイベントリスナーを追加する
document.addEventListener('DOMContentLoaded', () => {
    const twoFactorButton = document.getElementById('twoFactorButton');
    if (!twoFactorButton) {
        console.error("twoFactorButton が見つかりません");
        return;
    }
    twoFactorButton.addEventListener('click', twoFactorButtonClick);
});
