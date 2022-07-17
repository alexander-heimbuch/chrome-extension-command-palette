import { writable } from 'svelte/store'
import { sendMessage } from './helper/messages'
import type { Bookmark, Item, State, Tab } from './types'

export const data = writable<State>({
  mode: 'tabs',
  tabs: [],
  bookmarks: [],
  items: [],
  query: ''
})

export function init({ tabs, bookmarks }: { tabs: Tab[]; bookmarks: Bookmark[] }) {
  data.set({
    mode: 'tabs',
    tabs,
    bookmarks,
    items: tabs.slice(0, 15).map((tab, index) => ({
      ...tab,
      active: index === 0
    })),
    query: ''
  })
}

export function selectNextItem() {
  data.update((state: State) => {
    const currentIndex = state.items.findIndex((tab) => tab.active)

    if (currentIndex + 1 === state.items.length) {
      return {
        ...state,
        items: state.items.map((tab, index) => ({
          ...tab,
          active: index === 0
        }))
      }
    }

    return {
      ...state,
      items: state.items.map((tab, index) => ({ ...tab, active: index === currentIndex + 1 }))
    }
  })
}

export function selectPreviousItem() {
  data.update((state: State) => {
    const currentIndex = state.items.findIndex((tab) => tab.active)

    if (currentIndex === 0) {
      return {
        ...state,
        items: state.items.map((tab, index) => ({
          ...tab,
          active: index === state.items.length - 1
        }))
      }
    }

    return {
      ...state,
      items: state.items.map((tab, index) => ({ ...tab, active: index === currentIndex - 1 }))
    }
  })
}

export function searchItems(event: any) {
  const input = event?.target?.value
  let query
  let mode

  switch (true) {
    case input.startsWith('. '):
      mode = 'bookmarks'
      query = input.replace('. ', '')
      break

    default:
      mode = 'tabs'
      query = input
      break
  }

  const search = (elements: any[]) =>
    elements
      .filter((element) => !query || element?.title.toUpperCase().includes(query.toUpperCase()))
      .slice(0, 15)

  data.update((state: State) => {
    let items = []

    switch (mode) {
      case 'bookmarks':
        items = search(state.bookmarks)
        break
      case 'tabs':
        items = search(state.tabs)
    }

    return {
      ...state,
      mode,
      query,
      items
    }
  })
}

export function handleItem(item: Item) {
  const unsubscribe = data.subscribe((state) => {
    switch (state.mode) {
      case 'tabs':
        sendMessage('switchTab', item)
        break
      case 'bookmarks':
        sendMessage('openBookmark', item)
        break
    }
  })

  setTimeout(() => {
    unsubscribe()
    window.close()
  }, 100)
}
