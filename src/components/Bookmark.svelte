<script lang="ts">
  import type { Bookmark } from 'src/types'
  export let item: Bookmark
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  class="bookmarks-icon"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  stroke-width="2"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
  />
</svg>
<span class="bookmarks-text">{item.title}</span>

<style>
  .bookmarks-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .bookmarks-icon {
    margin-right: 8px;
    width: 14px;
    height: 14px;
  }
</style>
