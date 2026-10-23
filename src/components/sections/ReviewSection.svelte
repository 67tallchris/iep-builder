<script>
  import Section from '../Section.svelte';
  import AiBox from '../AiBox.svelte';
  import { draft, updateDraft, settings } from '../../lib/store.js';
  import { generate } from '../../lib/ai.js';
  import { runChecks, summarize } from '../../lib/compliance.js';
  import { exportDocx } from '../../lib/docx.js';

  $: aiReady = !!$settings.apiKey || !!$settings.baseUrl;
  $: summary = summarize(runChecks($draft));

  const ai = (kind) => (notes) => generate(kind, $draft, { notes });
  const apply = (path) => (text) => updateDraft((d) => {
    const parts = path.split('.');
    let obj = d;
    for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
    obj[parts[parts.length - 1]] = text;
  });

  function exportJson() {
    const blob = new Blob([JSON.stringify($draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${($draft.title || 'iep-draft').replace(/[^a-z0-9-_]+/gi, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<Section id="review" title="7 · LRE, Assessment, ESY & Review">
  <div class="field">
    <label for="lre">LRE explanation (extent of non-participation and why)</label>
    <textarea id="lre" bind:value={$draft.lre}></textarea>
    <div class="row" style="margin-top:6px;">
      <AiBox label="Draft LRE" onGenerate={ai('lre')} onApply={apply('lre')} disabled={!aiReady} />
    </div>
  </div>
  <div class="field">
    <label for="placement">Placement determination</label>
    <textarea id="placement" bind:value={$draft.placement}></textarea>
  </div>
  <div class="field">
    <label for="assessment">Assessment participation & accommodations</label>
    <textarea id="assessment" bind:value={$draft.assessment}></textarea>
    <div class="row" style="margin-top:6px;">
      <AiBox label="Draft assessment statement" onGenerate={ai('assessment')} onApply={apply('assessment')} disabled={!aiReady} />
    </div>
  </div>
  <div class="field">
    <label for="esy">ESY consideration (due no later than 45 days before the last school day)</label>
    <textarea id="esy" bind:value={$draft.esy}></textarea>
    <div class="row" style="margin-top:6px;">
      <AiBox label="Draft ESY consideration" onGenerate={ai('esy')} onApply={apply('esy')} disabled={!aiReady} />
    </div>
  </div>
  <div class="field">
    <label for="progress">Progress reporting (how and when)</label>
    <textarea id="progress" bind:value={$draft.progressReporting}></textarea>
  </div>

  <hr class="separator" />

  <div class="row" style="justify-content:space-between;">
    <h3 style="margin:0;">Postsecondary transition (9th grade or age 16, whichever first)</h3>
    <label style="font-weight:400; display:flex; gap:6px; align-items:center;">
      <input type="checkbox" bind:checked={$draft.transition.required} /> Required
    </label>
  </div>
  {#if $draft.transition.required}
    <div class="field">
      <label for="t-psg">Measurable postsecondary goals (training/education, employment)</label>
      <textarea id="t-psg" bind:value={$draft.transition.postsecondaryGoals}></textarea>
    </div>
    <div class="field">
      <label for="t-assess">Age-appropriate transition assessments</label>
      <textarea id="t-assess" bind:value={$draft.transition.assessments}></textarea>
    </div>
    <div class="field">
      <label for="t-serv">Transition services and activities</label>
      <textarea id="t-serv" bind:value={$draft.transition.services}></textarea>
    </div>
    <div class="field">
      <label for="t-courses">Courses of study (specific courses)</label>
      <textarea id="t-courses" bind:value={$draft.transition.courses}></textarea>
    </div>
    <div class="field">
      <label for="t-grad">Anticipated graduation date</label>
      <input id="t-grad" type="text" bind:value={$draft.transition.graduationDate} />
    </div>
  {/if}

  <div class="field">
    <label for="tor">Transfer of rights statement (one year before age 18)</label>
    <textarea id="tor" bind:value={$draft.transferOfRights}></textarea>
  </div>
  <div class="field">
    <label for="notes">Notes</label>
    <textarea id="notes" bind:value={$draft.notes}></textarea>
  </div>

  <hr class="separator" />

  <div class="row">
    <button class="btn primary" on:click={() => exportDocx($draft)}>Export .docx (Google Docs compatible)</button>
    <button class="btn" on:click={exportJson}>Export JSON</button>
  </div>
  <p class="muted" style="margin-top:8px;">
    Compliance summary: <span class="pill fail">{summary.fails.length} to fix</span>
    <span class="pill warn">{summary.warns.length} warnings</span>
    <span class="pill ok">{summary.passes.length} passing</span>
  </p>
</Section>
