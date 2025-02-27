import { initializeHeader } from './header.js';
import { initializeFooter } from './footer.js';

document.addEventListener('DOMContentLoaded', () => {
    // ヘッダーを描画
    const headerHTML = initializeHeader('部位マスタ');
    const muscleGroupDiv = document.getElementById('muscle-group');
    if (muscleGroupDiv) {
        muscleGroupDiv.insertAdjacentHTML('afterend', headerHTML);
    }

    // フッターを描画
    const footerHTML = initializeFooter();
    document.body.insertAdjacentHTML('beforeend', footerHTML);
});
