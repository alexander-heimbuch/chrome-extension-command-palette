import Popup from 'src/components/Popup.svelte'
import type { IStorage } from 'src/types'

chrome.storage.sync.get({ tabHistory: [] } as IStorage, ({ tabHistory }: IStorage) => {
  new Popup({
    target: document.body,
    props: { tabHistory }
  })
})
