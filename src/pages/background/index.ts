import { findTab } from 'src/helper/tabs'
import type { Message, Tab } from 'src/types'

chrome.tabs.onHighlighted.addListener(async (highlighted) => {
  const highlightedTabs = highlighted.tabIds.map((id) => ({
    id,
    windowId: highlighted.windowId
  }))

  const tabsAvailable = (await chrome.tabs.query({})) || []

  const tabsHistory: { windowId: number; id: number }[] = await chrome.storage.sync
    .get(['tabHistory'])
    .then(({ tabHistory }) => tabHistory || [])
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

  await chrome.storage.sync.set({ tabHistory: result })
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
  }

  return true
  // return true <- this and the callback in background.js are what caused a crash in extensions page of my Google chrome
})


chrome.commands.onCommand.addListener((command) => {
  console.log(`Command: ${command}`);
});
