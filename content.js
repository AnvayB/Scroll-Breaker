let timer = null;
let MODAL_ID = "mindful-scroll-modal";

function isShortsPage() {
  const url = window.location.href;
  return (
    url.includes("youtube.com/shorts") ||
    url.includes("tiktok.com")
  );
}

function startTimer() {
  if (timer) return;

  timer = setInterval(() => {
    showModal();
  }, 5 * 60 * 1000); // 5 minutes
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function showModal() {
  if (document.getElementById(MODAL_ID)) return;

  const modal = document.createElement("div");
  modal.id = MODAL_ID;
  modal.innerHTML = `
    <div class="mindful-box">
      <p>Are you enjoying your time right now?</p>
      <div class="buttons">
        <button id="yes-btn">Yes</button>
        <button id="no-btn">No</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("yes-btn").onclick = () => closeModal("yes");
  document.getElementById("no-btn").onclick = () => closeModal("no");
}

function closeModal(answer) {
    console.log("User answer:", answer);
  
    chrome.storage.local.get(["responses"], (res) => {
      const responses = res.responses || [];
      responses.push({
        answer,
        time: new Date().toISOString(),
        url: window.location.href
      });
      chrome.storage.local.set({ responses });
    });
  
    document.getElementById(MODAL_ID)?.remove();
  
    if (answer === "no") {
      // Small delay so storage write + UI cleanup completes
      setTimeout(() => {
        chrome.runtime.sendMessage({ type: "CLOSE_TAB" });
      }, 500);
    }
  }
  

// Watch for SPA navigation (important for YouTube/TikTok)
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    isShortsPage() ? startTimer() : stopTimer();
  }
}).observe(document, { subtree: true, childList: true });

// Initial load
if (isShortsPage()) startTimer();
