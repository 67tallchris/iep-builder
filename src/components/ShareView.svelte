<script>
  import { onMount } from 'svelte';
  import { fetchDraft } from '../lib/api.js';
  import { replaceDraft } from '../lib/store.js';
  import { exportDocx } from '../lib/docx.js';

  export let id = '';

  let state = 'loading';
  let error = '';
  let payload = null;
  let meta = null;

  onMount(async () => {
    try {
      const data = await fetchDraft(id);
      if (!data?.payload) throw new Error('Draft not found or not shared.');
      payload = data.payload;
      meta = data;
      state = 'ready';
    } catch (e) {
      error = e.message || String(e);
      state = 'error';
    }
  });

  function copyToMyDrafts() {
    const clone = structuredClone(payload);
    clone.cloud = null;
    clone.sourceExemplarId = payload.sourceExemplarId || null;
    clone.goals = (clone.goals || []).map((g) => ({ ...g, id: crypto.randomUUID() }));
    clone.services = (clone.services || []).map((s) => ({ ...s, id: crypto.randomUUID() }));
    clone.title = (clone.title || 'Shared draft') + ' (copy)';
    replaceDraft(clone);
    location.href = '/';
  }
</script>

<div class="app">
  <div class="nopii" role="alert">
    ⚠ Shared read-only draft. It must not contain real student names or identifying information.
  </div>
  <header class="header">
    <div class="header-inner">
      <div class="brand">IEP Builder <span class="tag">shared draft</span></div>
      <a href="/"><button class="btn small">Open the editor</button></a>
    </div>
  </header>

  <main class="center" style="padding:14px;">
    {#if state === 'loading'}
      <div class="card section">Loading shared draft…</div>
    {:else if state === 'error'}
      <div class="card section">
        <h2>Draft unavailable</h2>
        <p class="muted">{error}</p>
        <p class="muted">The owner may have made it private or deleted it.</p>
      </div>
    {:else}
      <div class="card section">
        <h1>{payload.title || 'IEP draft'}</h1>
        <p class="muted">
          Grade {payload.profile?.grade || '—'} · {payload.profile?.category || '—'}
          {payload.profile?.secondaryCategory ? ` / ${payload.profile.secondaryCategory}` : ''}
          {meta?.updated_at ? `· updated ${new Date(meta.updated_at).toLocaleString()}` : ''}
        </p>
        <div class="row">
          <button class="btn primary" on:click={copyToMyDrafts}>Copy to my drafts</button>
          <button class="btn" on:click={() => exportDocx(payload)}>Export .docx</button>
        </div>
      </div>

      <div class="card section">
        <div class="preview-section">
          <h3>Present levels (PLAAFP)</h3>
          {#if payload.plaafp?.academic}<p><strong>Academic:</strong> {payload.plaafp.academic}</p>{/if}
          {#if payload.plaafp?.functional}<p><strong>Functional:</strong> {payload.plaafp.functional}</p>{/if}
          {#if payload.plaafp?.impact}<p><strong>Impact:</strong> {payload.plaafp.impact}</p>{/if}
        </div>

        <div class="preview-section">
          <h3>Goals</h3>
          {#each payload.goals || [] as g, i}
            <p><strong>Goal {i + 1}{g.area ? ' — ' + g.area : ''}:</strong> Given {g.condition}, the student will {g.skill} from {g.baseline} to {g.target}, as measured by {g.measurement}, on {g.schedule}.</p>
          {/each}
        </div>

        <div class="preview-section">
          <h3>Services</h3>
          {#each payload.services || [] as s}
            <p>{s.type} — {s.frequency}, {s.duration}, {s.location}, {s.provider}</p>
          {/each}
        </div>

        {#if payload.accommodations?.length}
          <div class="preview-section">
            <h3>Accommodations</h3>
            <ul>{#each payload.accommodations as a}<li>{a}</li>{/each}</ul>
          </div>
        {/if}

        {#if payload.behaviorPlan?.enabled}
          <div class="preview-section">
            <h3>Behavior support plan</h3>
            <p><strong>Target:</strong> {payload.behaviorPlan.targetBehavior}</p>
            <p><strong>Function:</strong> {payload.behaviorPlan.function}</p>
            <p><strong>Monitoring:</strong> {payload.behaviorPlan.monitoring}</p>
          </div>
        {/if}

        <div class="preview-section">
          <h3>LRE, assessment, ESY</h3>
          <p><strong>LRE:</strong> {payload.lre}</p>
          <p><strong>Assessment:</strong> {payload.assessment}</p>
          <p><strong>ESY:</strong> {payload.esy}</p>
        </div>
      </div>

      <p class="muted" style="padding:0 4px 24px;">
        Draft for IEP team review. Not legal advice. The IEP team and public education agency remain responsible for compliance.
      </p>
    {/if}
  </main>
</div>
