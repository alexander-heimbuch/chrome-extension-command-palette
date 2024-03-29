<script lang="ts">
  import { data, handleItem, searchItems, selectNextItem, selectPreviousItem, init } from 'src/data'
  import { onDestroy, onMount } from 'svelte'
  import Tab from './Tab.svelte'
  import Bookmark from './Bookmark.svelte'
  import Shortcut from './Shortcut.svelte'

  export let tabs
  export let bookmarks
  let items
  let commandAction = false
  let searchInput: HTMLInputElement

  init({ tabs, bookmarks })

  const handleSubmit = (options: { shiftKey: boolean } = { shiftKey: false }) => {
    const activeItem = items.find((tab) => tab.active === true)

    if (activeItem) {
      return handleItem(activeItem, options)
    }
  }

  const keydownEvents = (event: KeyboardEvent) => {
    switch (true) {
      case event.key === 'ArrowDown':
        event.preventDefault()
        selectNextItem()
        break

      case event.key === 'ArrowUp':
        event.preventDefault()
        selectPreviousItem()
        break

      case event.key === 'p' && event.metaKey && event.shiftKey:
        event.preventDefault()
        commandAction = true
        selectPreviousItem()
        break

      case event.key === 'p' && event.metaKey:
        event.preventDefault()
        commandAction = true
        selectNextItem()
        break

      case event.key === 'Enter' && event.shiftKey:
        event.preventDefault()
        handleSubmit({ shiftKey: true })
        break

      case event.key === 'Enter':
        event.preventDefault()
        handleSubmit()
        break

      case event.key === 'Esc':
        window.close()
        break
    }
  }

  const keyupEvents = (event: KeyboardEvent) => {
    switch (true) {
      case event.key === 'Meta' && commandAction:
        event.preventDefault()
        handleItem(items.find((tab) => tab.active === true))
        break
    }
  }

  const unsubscribe = data.subscribe((state) => {
    items = state.items
  })

  document.addEventListener('keydown', keydownEvents)
  document.addEventListener('keyup', keyupEvents)

  onMount(() => searchInput.focus())
  onDestroy(unsubscribe)
  onDestroy(() => document.removeEventListener('keydown', keydownEvents))
  onDestroy(() => document.removeEventListener('keyup', keyupEvents))
</script>

<div class="popup">
  <input
    class="command-search"
    placeholder="Search tabs by name"
    type="text"
    bind:this={searchInput}
    on:input={(e) => searchItems(e)}
  />
  {#if items.length > 0}
    <ul>
      {#each items as item, i}
        <li>
          <button
            class="command-entry"
            on:click={(event) => handleItem(item, event)}
            class:active={item.active}
          >
            {#if item.type === 'tab'}
              <Tab {item} />
            {/if}
            {#if item.type === 'shortcut'}
              <Shortcut {item} />
            {/if}
            {#if item.type === 'bookmark'}
              <Bookmark {item} />
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  {:else}
    <div class="command-empty">No Matching Results</div>
  {/if}
</div>

<style>
  @import '../styles/environment';
  .popup {
    box-sizing: border-box;
    width: 600px;
    overflow: hidden;
    background: var(--background-dark);
    color: var(--text-primary);
    font-size: 14px;
    border: 1px solid var(--border-popup);
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  }

  ul,
  li {
    margin: 0;
    padding: 0;
    width: 100%;
  }

  button {
    background: none;
    border: none;
    color: inherit;
    font-size: inherit;
  }

  button:active,
  input {
    outline: none;
    border: none;
  }

  .command-search {
    display: block;
    width: calc(100% - 22px);
    background: var(--background);
    margin: 4px;
    border: 1px solid var(--border-search);
    color: inherit;
    font-size: inherit;
    padding: 8px 6px;
  }

  .command-empty {
    padding: 8px;
  }

  .command-entry, .command-entry svg {
    width: 100%;
    text-align: left;
    padding: 8px 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .command-entry.active, .command-entry.active svg {
    color: var(--text-entry-active);
    background: var(--background-entry);
  }
  .command-entry:hover {
    background: var(--background-entry-hover);
  }
</style>
