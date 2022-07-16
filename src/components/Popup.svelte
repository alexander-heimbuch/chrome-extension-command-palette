<script lang="ts">
  import { sendMessage } from 'src/helper/messages'
  import { onDestroy, onMount } from 'svelte'
  import { writable } from 'svelte/store'

  export let tabHistory
  let tabs
  let commandAction = false
  let searchInput

  const tabsStore = writable([])

  const reset = (items) =>
    items.slice(0, 15).map((tab, index) => ({
      ...tab,
      active: index === 0
    }))

  tabsStore.set(reset(tabHistory))

  function switchTab(tab) {
    sendMessage('switchTab', tab)
    setTimeout(() => {
      window.close()
    }, 100)
  }

  function selectNextTab() {
    tabsStore.update((tabs) => {
      const currentIndex = tabs.findIndex((tab) => tab.active)

      if (currentIndex + 1 === tabs.length) {
        return tabs.map((tab, index) => ({
          ...tab,
          active: index === 0
        }))
      }

      return tabs.map((tab, index) => ({ ...tab, active: index === currentIndex + 1 }))
    })
  }

  function selectPreviousTab() {
    tabsStore.update((tabs) => {
      const currentIndex = tabs.findIndex((tab) => tab.active)

      if (currentIndex === 0) {
        return tabs.map((tab, index) => ({
          ...tab,
          active: index === tabs.length - 1
        }))
      }

      return tabs.map((tab, index) => ({ ...tab, active: index === currentIndex - 1 }))
    })
  }

  function searchTabs(event: any) {
    const query = event?.target?.value

    tabsStore.set(
      reset(
        tabHistory.filter((tab) => !query || tab.title.toUpperCase().includes(query.toUpperCase()))
      )
    )
  }

  const keydownEvents = (event: KeyboardEvent) => {
    switch (true) {
      case event.key === 'ArrowDown':
        event.preventDefault()
        selectNextTab()
        break

      case event.key === 'ArrowUp':
        event.preventDefault()
        selectPreviousTab()
        break

      case event.key === 'p' && event.metaKey:
        event.preventDefault()
        commandAction = true
        selectNextTab()
        break

      case event.key === 'Enter':
        event.preventDefault()
        switchTab(tabs.find((tab) => tab.active === true))
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
        switchTab(tabs.find((tab) => tab.active === true))
        break
    }
  }

  const unsubscribe = tabsStore.subscribe((value) => {
    tabs = value
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
    on:input={(e) => searchTabs(e)}
  />
  {#if tabs.length > 0}
    <ul>
      {#each tabs as tab, i}
        <li>
          <button class="command-entry" on:click={() => switchTab(tab)} class:active={tab.active}>
            {#if tab.favIconUrl}
              <img src={tab.favIconUrl} class="command-icon" alt="favicon" />
            {:else}
              <span class="command-icon" />
            {/if}
            <span class="command-text">{tab.title}</span></button
          >
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

  .command-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .command-entry.active {
    background: #1177bb;
  }

  .command-entry:hover {
    background: #264f78;
  }

  .command-icon {
    margin-right: 8px;
    width: 14px;
    height: 14px;
  }
</style>
