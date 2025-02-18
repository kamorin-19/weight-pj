import axios from "axios";

const handleLoginClick = async (): Promise<void> => {
  console.log("★");
  const usernameInput = document.getElementById('username') as HTMLInputElement | null;
  const passwordInput = document.getElementById('password') as HTMLInputElement | null;

  if (!usernameInput || !passwordInput) return;
  console.log("★★");

  const username = usernameInput.value;
  const password = passwordInput.value;

  try {
    console.log("★★★");
    const response = await axios.post('http://localhost/login', { username, password });
    console.log(1);
    console.log('Response:', response.data);
  } catch (error) {
    console.log("★★★★");
    console.log(2);
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
