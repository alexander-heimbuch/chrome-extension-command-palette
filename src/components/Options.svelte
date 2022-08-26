<script lang="ts">
  import { sendMessage } from 'src/helper/messages'

  function openShortcuts() {
    sendMessage('openUrlInNewTab', { url: 'chrome://extensions/shortcuts' })
  }
</script>

<div class="options">
  <h3>Shortcuts</h3>
  <div class="description">
    Some keyboard shortcuts are assigned system-wide by Chrome. Please set the "Activate the extension"
    keyboard shortcut also in the <a href="#" on:click={openShortcuts}>global shortcuts</a>.
  </div>
</div>

<style>
  @import '../styles/environment.css';

  .options {
    background: var(--background);
    color: var(--text-primary);
    padding: 20px 25px;
  }

  h3 {
    margin: 0;
    padding: 0;
    margin-bottom: 10px;
    font-weight: 500;
  }

  .description {
    color: var(--text-secondary);
  }

  a {
    color: var(--text-secondary);
  }
</style>
