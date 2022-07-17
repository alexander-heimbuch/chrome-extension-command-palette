export type IStorage = {
  tabs: Tab[]
  bookmarks: Bookmark[]
}

export interface Tab {
  windowId: number
  id: number
  index: number
  title: string
  url: string
  favIconUrl: string
}

export interface SwitchTabMessage {
  type: 'switchTab'
  options: Tab
}

export interface OpenBookmarkMessage {
  type: 'openBookmark'
  options: Bookmark
}

export interface Item {
  [key: string]: any
  active: boolean
  title: string
}

export type Message = SwitchTabMessage | OpenBookmarkMessage

export interface State {
  mode: 'tabs' | 'bookmarks'
  tabs: Tab[]
  bookmarks: any[]
  items: Item[]
  query: string
}


export interface Bookmark {
  title: string
  url: string
}
