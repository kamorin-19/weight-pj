import { initializeHeader } from '../components/header.js';
import { initializeFooter } from '../components/footer.js';
// ページ読み込み時にヘッダーとフッターを描画
document.addEventListener('DOMContentLoaded', () => {
    // ヘッダー描画
    showHeader();
    // フッター描画
    showFooter();
});
/**
 * ページのヘッダーを初期化して表示する
 *
 * 「メニュー」というタイトルを持つヘッダーを生成し、
 * 'app' IDを持つ要素の直前に挿入します。
 *
 * @returns {void} この関数は戻り値を持ちません
 *
 * @requires initializeHeader 関数が定義されていること
 * @requires 'muscle-group' IDを持つDOM要素が存在すること
 *
 * @example
 * // ページロード時やナビゲーション後に呼び出す
 * showHeader();
 */
const showHeader = () => {
    // ヘッダーを描画
    const headerHTML = initializeHeader('メニュー');
    const appDiv = document.getElementById('app');
    if (appDiv) {
        appDiv.insertAdjacentHTML('beforebegin', headerHTML);
    }
};
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
        appDiv.insertAdjacentHTML('afterend', footerHTML);
    }
};
