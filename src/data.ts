import { writable } from 'svelte/store'
import { sendMessage } from './helper/messages'
import type { Bookmark, Item, State, Tab } from './types'
import shortcuts from './chrome-shortcuts'

export const data = writable<State>({
  mode: 'tabs',
  tabs: [],
  bookmarks: [],
  items: [],
  query: '',
  shortcuts: shortcuts.map((shortcut) => ({ ...shortcut, type: 'shortcut' }))
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
    query: '',
    shortcuts: shortcuts.map((shortcut) => ({ ...shortcut, type: 'shortcut' }))
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
  const query = event?.target?.value

  const search = (elements: any[]) =>
    elements
      .filter((element) => !query || element?.title.toUpperCase().includes(query.toUpperCase()))
      .slice(0, 15)
      .map((element, index) => ({
        ...element,
        active: index === 0
      }))

  data.update((state: State) => {
    return {
      ...state,
      query,
      items: search([...state.tabs, ...state.bookmarks, ...state.shortcuts])
    }
  })
}

export function handleItem(item: Item, options: { shiftKey: boolean } = { shiftKey: false }) {
  switch (true) {
    case item.type === 'tab':
      sendMessage('switchTab', item)
      break
    case item.type === 'bookmark' && options.shiftKey:
      sendMessage('openUrlInNewTab', item)
      break
    case item.type === 'bookmark':
      sendMessage('openUrlInCurrentTab', item)
      break
    case item.type === 'shortcut' && options.shiftKey:
      sendMessage('openUrlInNewTab', item)
      break
    case item.type === 'shortcut':
      sendMessage('openUrlInCurrentTab', item)
      break
  }

  setTimeout(() => {
    window.close()
  }, 100)
}
