export function initializeHeader(pageName) {
    // ヘッダー部分のHTML
    const headerHTML = `
        <header>
            <div class="header-content">
                <h1>${pageName}</h1>
                <div class="hamburger-menu">
                    <input type="checkbox" id="menu-toggle" class="menu-toggle">
                    <label for="menu-toggle" class="menu-button">
                        <span></span>
                        <span></span>
                        <span></span>
                    </label>
                    <nav class="menu-content">
                        <ul>
                            <li><a href="#">体重記録</a></li>
                            <li><a href="#">筋トレ記録</a></li>
                            <li><a href="#">カロリー記録</a></li>
                            <li><a href="#">データ推移</a></li>
                            <li><a href="#">CSV取込</a></li>
                            <li><a href="#">種目マスタ</a></li>
                            <li><a href="muscle-group.html">部位マスタ</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    `;
    // スタイルの追加
    const style = document.createElement('style');
    style.textContent = `
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        header {
            background-color: #007bff;
            color: white;
            padding: 1rem;
            text-align: center;
        }
        h1 {
            margin: 0;
        }
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
        }
        .hamburger-menu {
            position: relative;
        }
        .menu-toggle {
            display: none;
        }
        .menu-button {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 30px;
            height: 21px;
            cursor: pointer;
        }
        .menu-button span {
            display: block;
            width: 100%;
            height: 3px;
            background-color: white;
            transition: all 0.3s ease;
        }
        .menu-toggle:checked ~ .menu-button span:nth-child(1) {
            transform: translateY(9px) rotate(45deg);
        }
        .menu-toggle:checked ~ .menu-button span:nth-child(2) {
            opacity: 0;
        }
        .menu-toggle:checked ~ .menu-button span:nth-child(3) {
            transform: translateY(-9px) rotate(-45deg);
        }
        .menu-content {
            position: absolute;
            right: 0;
            top: 100%;
            background: white;
            padding: 1rem;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            display: none;
            min-width: 200px;
        }
        .menu-toggle:checked ~ .menu-content {
            display: block;
        }
        .menu-content ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .menu-content li {
            margin: 10px 0;
        }
        .menu-content a {
            color: #333;
            text-decoration: none;
            display: block;
            padding: 5px 10px;
            transition: background-color 0.3s;
        }
        .menu-content a:hover {
            background-color: #f5f5f5;
        }
    `;
    // スタイルをheadに追加
    document.head.appendChild(style);
    // ヘッダーを返却する
    return headerHTML;
}
