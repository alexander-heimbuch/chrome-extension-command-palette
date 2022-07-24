export type IStorage = {
  tabs: Tab[]
  bookmarks: Bookmark[]
}

export interface Tab {
  type: 'tab'
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

export interface OpenUrlInNewTabMessage {
  type: 'openUrlInNewTab'
  options: Bookmark
}

export interface OpenUrlInCurrentTabMessage {
  type: 'openUrlInCurrentTab'
  options: Bookmark
}

export interface Item {
  [key: string]: any
  active: boolean
  title: string
  type: 'tab' | 'bookmark' | 'shortcut'
}

export type Message = SwitchTabMessage | OpenUrlInCurrentTabMessage | OpenUrlInNewTabMessage

export interface State {
  mode: 'tabs' | 'bookmarks'
  tabs: Tab[]
  bookmarks: any[]
  items: Item[]
  query: string
  shortcuts: Shortcut[]
}

export interface Bookmark {
  type: 'bookmark'
  title: string
  url: string
}

export interface Shortcut {
  type: 'shortcut',
  title: string,
  url: string
}
