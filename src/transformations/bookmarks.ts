import type { Bookmark } from 'src/types'

function extractTitle(bookmark: chrome.bookmarks.BookmarkTreeNode, list: chrome.bookmarks.BookmarkTreeNode[]): string[] {
  const parent = list.find(item => item.id === bookmark.parentId);

  return [...(parent ? extractTitle(parent, list) : []), bookmark.title]
}

export function extract(bookmark: chrome.bookmarks.BookmarkTreeNode, list: chrome.bookmarks.BookmarkTreeNode[]): Bookmark | null {
  if (!bookmark.url) {
    return null
  }

  return {
    type: 'bookmark',
    url: bookmark.url,
    title: extractTitle(bookmark, list).join(' > ')
  }
}
