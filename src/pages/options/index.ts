import Options from 'src/components/Options.svelte'
import type { IStorage } from 'src/types'

chrome.storage.local.get({} as IStorage, () => {
  new Options({
    target: document.body
  })
})
