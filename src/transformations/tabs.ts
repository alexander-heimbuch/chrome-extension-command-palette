import type { Tab } from "src/types";

export function extract(raw: chrome.tabs.Tab) : Tab {
  return {
    type: 'tab',
    id: raw.id,
    index: raw.index,
    windowId: raw.windowId,
    title: raw.title,
    url: raw.url,
    favIconUrl: raw.favIconUrl
  }
}
