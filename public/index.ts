import axios from "axios";

const handleLoginClick = async (): Promise<void> => {

  const usernameInput = document.getElementById('username') as HTMLInputElement | null;
  const passwordInput = document.getElementById('password') as HTMLInputElement | null;

  if (!usernameInput || !passwordInput) return;

  const username = usernameInput.value;
  const password = passwordInput.value;

  try {
    // 修正: エンドポイントを LoginController.php に変更（api フォルダ内）
    const response = await axios.post('http://localhost:8089/api/LoginController/login', 
        { username, password },
        {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
    );
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// DOMが読み込まれてからイベントリスナーを追加する
document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('loginButton');
  if (!loginButton) {
    console.error("loginButton が見つかりません");
    return;
  }
  loginButton.addEventListener('click', handleLoginClick);
});
