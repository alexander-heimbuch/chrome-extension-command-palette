export type IStorage = {
  tabHistory: Tab[]
}

export interface Tab {
  windowId: number
  id: number
  index: number
  title: string
  url: string
  favIconUrl: string

}

export interface OpenTabMessage {
  type: 'switchTab'
  options: {
    windowId: number
    index: number
  }
}

export type Message = OpenTabMessage
