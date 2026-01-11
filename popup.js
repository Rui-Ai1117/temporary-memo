const memo = document.getElementById('memo');
const detachBtn = document.getElementById('detachBtn');
const copyBtn = document.getElementById('copyBtn');

// 1. データの復元
chrome.storage.local.get(['text', 'width', 'height'], (data) => {
  if (data.text) memo.value = data.text;
  if (data.width) memo.style.width = data.width + 'px';
  if (data.height) memo.style.height = data.height + 'px';
});

// 2. 自動保存
memo.addEventListener('input', () => {
  chrome.storage.local.set({ text: memo.value });
});

// 3. サイズ保存
memo.addEventListener('mouseup', () => {
  chrome.storage.local.set({
    width: memo.offsetWidth,
    height: memo.offsetHeight
  });
});

// 4. 全コピー機能
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(memo.value).then(() => {
    const originalIcon = copyBtn.innerText;
    copyBtn.innerText = "✅";
    setTimeout(() => { copyBtn.innerText = originalIcon; }, 1000);
  });
});

// 5. 別窓で開く
detachBtn.addEventListener('click', () => {
  chrome.windows.create({
    url: 'popup.html',
    type: 'popup',
    width: memo.offsetWidth + 30,
    height: memo.offsetHeight + 100
  });
});