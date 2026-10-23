<script>
  export let label = 'Draft with AI';
  export let notesLabel = 'Notes for the assistant';
  export let onGenerate = async () => '';
  export let applyLabel = 'Apply';
  export let onApply = () => {};
  export let disabled = false;
  export let disabledReason = 'Add your AI key in Settings to use this.';

  let open = false;
  let notes = '';
  let output = '';
  let busy = false;
  let error = '';

  async function run() {
    busy = true;
    error = '';
    try {
      output = await onGenerate(notes);
    } catch (e) {
      error = e.message || String(e);
    } finally {
      busy = false;
    }
  }

  function apply() {
    onApply(output);
    open = false;
    output = '';
  }
</script>

{#if disabled}
  <button class="btn small" disabled title={disabledReason}>✨ {label}</button>
{:else}
  <button class="btn small" on:click={() => (open = !open)}>✨ {label}</button>
{/if}

{#if open}
  <div class="card" style="padding:10px; margin-top:8px; background:#fbfcff; border-color:#c7d6f8;">
    <div class="field">
      <label for={`ai-notes-${label}`}>{notesLabel}</label>
      <textarea id={`ai-notes-${label}`} bind:value={notes} placeholder="Short bullet notes — the assistant will expand them."></textarea>
    </div>
    <div class="row">
      <button class="btn small primary" disabled={busy} on:click={run}>{busy ? 'Drafting…' : 'Generate'}</button>
      {#if output}<button class="btn small" on:click={apply}>{applyLabel}</button>{/if}
      <button class="btn small" on:click={() => (open = false)}>Close</button>
    </div>
    {#if error}<p class="muted" style="color:var(--fail)">{error}</p>{/if}
    {#if output}
      <div class="ro-value" style="margin-top:8px;">{output}</div>
      <p class="muted">AI drafts are suggestions. Review and edit before use. No real student data should ever be entered.</p>
    {/if}
  </div>
{/if}
