<script>
  import { draft, updateDraft } from '../lib/store.js';
  import { setShared } from '../lib/api.js';

  export let onClose = () => {};
  export let onSave = async () => {};
  export let onToast = () => {};

  let busy = false;
  let error = '';

  $: link = $draft.cloud?.id ? `${location.origin}/share/${$draft.cloud.id}` : '';

  async function ensureSaved() {
    if ($draft.cloud?.id) return;
    busy = true;
    error = '';
    try {
      await onSave();
    } catch (e) {
      error = e.message || String(e);
    } finally {
      busy = false;
    }
  }

  async function toggle(next) {
    busy = true;
    error = '';
    try {
      if (!$draft.cloud?.id) await ensureSaved();
      if (!$draft.cloud?.id) throw new Error('Save failed; try again.');
      await setShared($draft.cloud.id, $draft.cloud.editToken, next);
      updateDraft((d) => { d.cloud.shared = next; });
      onToast(next ? 'Sharing enabled.' : 'Sharing disabled.');
    } catch (e) {
      error = e.message || String(e);
    } finally {
      busy = false;
    }
  }

  function copyLink() {
    navigator.clipboard?.writeText(link);
    onToast('Share link copied.');
  }
</script>

<div class="modal-backdrop" role="dialog" aria-modal="true" aria-label="Share draft">
  <div class="modal">
    <div class="row" style="justify-content:space-between;">
      <h2 style="margin:0;">Share draft</h2>
      <button class="btn small" on:click={onClose}>Close</button>
    </div>
    <p class="muted">
      Shared drafts are read-only for visitors. Only share drafts that contain no real student data —
      the link is unlisted but anyone with it can view the draft.
    </p>

    {#if !$draft.cloud?.id}
      <p>This draft is not saved to the cloud yet.</p>
      <button class="btn primary" disabled={busy} on:click={ensureSaved}>{busy ? 'Saving…' : 'Save to cloud'}</button>
    {:else}
      <div class="field">
        <label for="share-link">Read-only link</label>
        <input id="share-link" type="text" readonly value={link} on:focus={(e) => e.target.select()} />
      </div>
      <div class="row">
        <button class="btn" on:click={copyLink}>Copy link</button>
        {#if $draft.cloud.shared}
          <button class="btn" disabled={busy} on:click={() => toggle(false)}>Make private</button>
        {:else}
          <button class="btn primary" disabled={busy} on:click={() => toggle(true)}>{busy ? 'Working…' : 'Enable sharing'}</button>
        {/if}
      </div>
      <p class="muted" style="margin-top:8px;">
        Status: {$draft.cloud.shared ? 'Shared (anyone with the link can view)' : 'Private (link will not load)'}
      </p>
    {/if}
    {#if error}<p style="color:var(--fail)">{error}</p>{/if}
  </div>
</div>
