<script lang="ts">
  import type { Tab } from 'src/types'
  export let item: Tab
</script>

{#if item.favIconUrl}
  <img src={item.favIconUrl} class="tabs-icon" />
{:else}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="tabs-icon"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
{/if}
<span class="tabs-text">{item.title}</span>

<style>
  .tabs-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .tabs-icon {
    margin-right: 8px;
    width: 14px;
    height: 14px;
  }
</style>
