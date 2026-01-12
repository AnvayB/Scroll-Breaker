chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "CLOSE_TAB" && sender.tab?.id) {
      chrome.tabs.remove(sender.tab.id);
    }
  });
  