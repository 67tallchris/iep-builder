<script>
  export let onNew = () => {};
  export let onSave = () => {};
  export let onShare = () => {};
  export let onExportDocx = () => {};
  export let onExportJson = () => {};
  export let onImport = () => {};
  export let onSettings = () => {};
  export let onToggleLeft = () => {};
  export let onToggleRight = () => {};
  export let saving = false;
  export let cloudLabel = 'Local only';
</script>

<header class="header">
  <div class="header-inner">
    <div class="brand">
      <button class="btn small" title="Toggle exemplars/snippets panel" on:click={onToggleLeft}>☰</button>
      IEP Builder <span class="tag">AZ · K–8 · v0.1</span>
    </div>
    <span class="muted" title="Cloud save status">{cloudLabel}</span>
    <button class="btn small" on:click={onNew}>New</button>
    <button class="btn small" on:click={onImport}>Import</button>
    <button class="btn small" on:click={onExportJson}>JSON</button>
    <button class="btn small" on:click={onExportDocx}>Export .docx</button>
    <button class="btn small primary" disabled={saving} on:click={onSave}>{saving ? 'Saving…' : 'Save'}</button>
    <button class="btn small" on:click={onShare}>Share</button>
    <button class="btn small" title="AI settings (BYOK)" on:click={onSettings}>⚙</button>
    <button class="btn small" title="Toggle compliance panel" on:click={onToggleRight}>✓</button>
  </div>
</header>
