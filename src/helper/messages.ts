export function sendMessage(type: string, options: {[key: string]: any} = {}) {
  chrome.runtime.sendMessage({type, options });
}

