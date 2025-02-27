export function initializeFooter(): string {
    // フッター部分のHTML
    const footerHTML = `
        <footer>
            <div class="footer-content">
                <p>&copy; 2024 Weight Training App</p>
            </div>
        </footer>
    `;

    // スタイルの追加
    const style = document.createElement('style');
    style.textContent = `
        footer {
            background-color: #007bff;
            color: white;
            padding: 1rem;
            text-align: center;
            position: fixed;
            bottom: 0;
            width: 100%;
        }
        
        .footer-content {
            display: flex;
            justify-content: center;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .footer-content p {
            margin: 0;
            font-size: 0.9rem;
        }
    `;

    // スタイルをheadに追加
    document.head.appendChild(style);

    // フッターを返却する
    return footerHTML;
} 