const toggleBtn = document.getElementById("toggle");
const addBtn = document.getElementById("addWord");
const wordInput = document.getElementById("customWord");
const wordList = document.getElementById("wordList");

let enabled = false;
let customWords = [];

toggleBtn.addEventListener("click", () => {
  enabled = !enabled;
  toggleBtn.textContent = enabled ? "Disable Blur" : "Enable Blur";
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "toggle" });
  });
});

addBtn.addEventListener("click", () => {
  const word = wordInput.value.trim();
  if (word) {
    customWords.push(word);
    chrome.storage.sync.set({ customWords });
    renderList();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { command: "updateCustom", words: customWords });
    });
    wordInput.value = "";
  }
});

function renderList() {
  wordList.innerHTML = "";
  customWords.forEach(w => {
    const li = document.createElement("li");
    li.textContent = w;
    wordList.appendChild(li);
  });
}

chrome.storage.sync.get("customWords", (data) => {
  customWords = data.customWords || [];
  renderList();
});
