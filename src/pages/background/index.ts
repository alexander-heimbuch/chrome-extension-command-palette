import { findTab } from 'src/helper/tabs'
import type { Message, Tab } from 'src/types'
import * as bookmarkTransformation from 'src/transformations/bookmarks';

chrome.tabs.onHighlighted.addListener(async (highlighted) => {
  const highlightedTabs = highlighted.tabIds.map((id) => ({
    id,
    windowId: highlighted.windowId
  }))

  const tabsAvailable = (await chrome.tabs.query({})) || []

  const tabsHistory: { windowId: number; id: number }[] = await chrome.storage.sync
    .get(['tabs'])
    .then(({ tabs }) => tabs || [])
    .then((result) =>
      result
        .filter((history) => findTab(tabsAvailable, history))
        .filter((history) => !findTab(highlightedTabs, history))
    )

  const fillerTabs = tabsAvailable.filter(
    (available) => !findTab([...highlightedTabs, ...tabsHistory], available)
  )

  const result: Tab[] = [...highlightedTabs, ...tabsHistory, ...fillerTabs]
    .map((tab) => findTab(tabsAvailable, tab))
    .map(({ windowId, id, title, url, favIconUrl, index }) => ({
      windowId,
      id,
      title,
      url,
      favIconUrl,
      index
    }))

  await chrome.storage.sync.set({ tabs: result })
})

chrome.runtime.onMessage.addListener(async (message: Message) => {
  switch (message.type) {
    case 'switchTab':
      if (message.options.windowId !== chrome.windows.WINDOW_ID_CURRENT) {
        await chrome.windows.update(message.options.windowId, {
          focused: true
        })
      }

      await chrome.tabs.highlight({
        windowId: message.options.windowId,
        tabs: message.options.index
      })
      break
    case 'openBookmark':
      await chrome.tabs.create({url: message.options.url });
      break;
  }

  return true
  // return true <- this and the callback in background.js are what caused a crash in extensions page of my Google chrome
})

async function fetchBookmarks() {
  const bookmarks = await chrome.bookmarks.search({})
  await chrome.storage.sync.set({ bookmarks: bookmarks.map(bookmark => bookmarkTransformation.extract(bookmark, bookmarks)).filter(Boolean) })
}


chrome.bookmarks.onChanged.addListener(fetchBookmarks);
chrome.runtime.onInstalled.addListener(fetchBookmarks)
