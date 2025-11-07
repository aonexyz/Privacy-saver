let enabled = false;
let customWords = [];

function blurSensitive() {
  if (!enabled) return;

  const regexList = [
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, // email
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // phone
    /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, // credit card
    /\b[A-Za-z0-9]{32,}\b/g, // token / api key
    ...customWords.map(w => new RegExp(w, "gi"))
  ];

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    let text = node.nodeValue;
    for (const regex of regexList) {
      if (regex.test(text)) {
        const span = document.createElement("span");
        span.className = "privacy-blur";
        span.textContent = text;
        span.style.filter = "blur(6px)";
        node.parentNode.replaceChild(span, node);
        break;
      }
    }
  }
}

chrome.runtime.onMessage.addListener((req) => {
  if (req.command === "toggle") {
    enabled = !enabled;
    if (enabled) blurSensitive();
  }
  if (req.command === "updateCustom") {
    customWords = req.words || [];
  }
});
