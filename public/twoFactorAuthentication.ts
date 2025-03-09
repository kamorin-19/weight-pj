import axios from "axios";

const twoFactorButtonClick = async (): Promise<void> => {

  try {
    // 修正: エンドポイントを LoginController.php に変更（api フォルダ内）
    const response = await axios.post('http://localhost:8089/api/Base/TwoFactorAuthenticationController/Authentication', 
        { },
        {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
    );
    if (response.data.message === 'Login successful') {
      window.location.href = './views/menu.html';
    } else {
      console.log('Response:', response.data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// DOMが読み込まれてからイベントリスナーを追加する
document.addEventListener('DOMContentLoaded', () => {
  const twoFactorButton = document.getElementById('twoFactorButton');
  if (!twoFactorButton) {
    console.error("twoFactorButton が見つかりません");
    return;
  }
  twoFactorButton.addEventListener('click', twoFactorButtonClick);
});
