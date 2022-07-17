import Popup from 'src/components/Popup.svelte'
import type { IStorage } from 'src/types'

chrome.storage.sync.get({ tabs: [], bookmarks: [] } as IStorage, ({ tabs, bookmarks }: IStorage) => {
  new Popup({
    target: document.body,
    props: { tabs, bookmarks }
  })
})
