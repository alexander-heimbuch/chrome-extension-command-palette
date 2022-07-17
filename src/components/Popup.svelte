<script lang="ts">
  import { data, handleItem, searchItems, selectNextItem, selectPreviousItem, init } from 'src/data'
  import { onDestroy, onMount } from 'svelte'
  import Tab from './Tab.svelte'
  import Bookmark from './Bookmark.svelte'

  export let tabs
  export let bookmarks
  let items
  let mode
  let commandAction = false
  let searchInput: HTMLInputElement

  init({ tabs, bookmarks })

  const handleSubmit = () => {
    const activeItem = items.find((tab) => tab.active === true);

    if (activeItem) {
      return handleItem(activeItem)
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

      case event.key === 'p' && event.metaKey:
        event.preventDefault()
        commandAction = true
        selectNextItem()
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
    mode = state.mode
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
            on:click={() => handleItem(item)}
            class:active={item.active}
          >
            {#if mode === 'tabs'}
              <Tab {item} />
            {/if}
            {#if mode === 'bookmarks'}
              <Bookmark {item} />
            {/if}
        </li>
      {/each}
    </ul>
  {:else}
    <div class="command-empty">No Matching Results</div>
  {/if}
</div>

<style>
  .popup {
    box-sizing: border-box;
    width: 600px;
    overflow: hidden;
    background: #252526;
    color: #d4d4d4;
    font-size: 14px;
    border: 1px solid #007acc;
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
    background: #3c3c3c;
    margin: 4px;
    border: 1px solid #04395e;
    color: inherit;
    font-size: inherit;
    padding: 8px 6px;
  }

  .command-empty {
    padding: 8px;
  }

  .command-entry {
    width: 100%;
    text-align: left;
    padding: 8px 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }


  .command-entry.active {
    background: #1177bb;
  }
  .command-entry:hover {
    background: #264f78;
  }
</style>
