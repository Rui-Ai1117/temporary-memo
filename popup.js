document.addEventListener('DOMContentLoaded', () => {
    const memoArea = document.getElementById('memo');
    const totalChars = document.getElementById('total-chars');
    const pureChars = document.getElementById('pure-chars');
    const lineCount = document.getElementById('line-count');
    const copyBtn = document.getElementById('copy-btn');
    const popoutBtn = document.getElementById('popout-btn');

    // 文字数と行数を計算する関数
    const updateStats = () => {
        const text = memoArea.value;
        
        // 1. 全文字数
        totalChars.textContent = text.length;

        // 2. 空白・改行を除いた文字数
        const pureText = text.replace(/\s+/g, '');
        pureChars.textContent = pureText.length;

        // 3. 行数（文字がなければ0行）
        const lines = text ? text.split(/\n/).length : 0;
        lineCount.textContent = lines;
    };

    // 保存データの読み込み
    chrome.storage.local.get(['memoText'], (res) => {
        if (res.memoText) {
            memoArea.value = res.memoText;
            updateStats();
        }
    });

    // 入力のたびに保存とカウント更新
    memoArea.addEventListener('input', () => {
        updateStats();
        chrome.storage.local.set({ memoText: memoArea.value });
    });

    // コピー機能
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(memoArea.value).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✅ 完了';
            setTimeout(() => { copyBtn.textContent = originalText; }, 1000);
        });
    });

    // 別窓で開く機能
    popoutBtn.addEventListener('click', () => {
        chrome.windows.create({
            url: 'popup.html',
            type: 'popup',
            width: 400,
            height: 550
        });
    });
});