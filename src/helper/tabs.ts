import { curry } from 'ramda'

export const findTab = curry(
  (
    tabs: { id: number; windowId: number }[] = [],
    needle: { id: number; windowId: number }
  ) => tabs.find((tab) => tab.id === needle?.id && tab.windowId === needle?.windowId)
)
