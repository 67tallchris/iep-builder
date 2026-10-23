<script>
  import Section from '../Section.svelte';
  import AiBox from '../AiBox.svelte';
  import { draft, updateDraft, settings } from '../../lib/store.js';
  import { generate } from '../../lib/ai.js';

  $: aiReady = !!$settings.apiKey || !!$settings.baseUrl;

  function addBaseline() {
    updateDraft((d) => d.plaafp.baselines.push({ skill: '', measure: '', score: '', date: '' }));
  }
  function removeBaseline(i) {
    updateDraft((d) => d.plaafp.baselines.splice(i, 1));
  }
  async function aiPlaafp(notes) {
    return generate('plaafp', $draft, { notes });
  }
  function applyPlaafp(text) {
    updateDraft((d) => {
      d.plaafp.academic = text;
    });
  }
</script>

<Section id="plaafp" title="2 · Present Levels (PLAAFP)">
  <div class="section-head" style="margin-top:-6px;">
    <span class="muted">Strengths, parent concerns, evaluation results, skill-based baselines, and impact of the disability.</span>
    <AiBox
      label="Draft PLAAFP"
      onGenerate={aiPlaafp}
      applyLabel="Apply to Academic field"
      onApply={applyPlaafp}
      disabled={!aiReady}
    />
  </div>

  <div class="field">
    <label for="strengths">Strengths</label>
    <textarea id="strengths" bind:value={$draft.plaafp.strengths}></textarea>
  </div>
  <div class="field">
    <label for="parent-concerns">Parent concerns</label>
    <textarea id="parent-concerns" bind:value={$draft.plaafp.parentConcerns}></textarea>
  </div>
  <div class="field">
    <label for="evaluation">Results of initial or most recent evaluation</label>
    <textarea id="evaluation" bind:value={$draft.plaafp.evaluation}></textarea>
  </div>
  <div class="field">
    <label for="academic">Academic present levels (skill-based data)</label>
    <textarea id="academic" bind:value={$draft.plaafp.academic}></textarea>
  </div>
  <div class="field">
    <label for="functional">Functional present levels</label>
    <textarea id="functional" bind:value={$draft.plaafp.functional}></textarea>
  </div>
  <div class="field">
    <label for="impact">Impact of the disability on involvement and progress in the general curriculum</label>
    <textarea id="impact" bind:value={$draft.plaafp.impact}></textarea>
  </div>

  <h3>Baseline data</h3>
  {#each $draft.plaafp.baselines as b, i}
    <div class="grid-3" style="align-items:end;">
      <div class="field">
        <label for={`b-skill-${i}`}>Skill</label>
        <input id={`b-skill-${i}`} type="text" bind:value={b.skill} />
      </div>
      <div class="field">
        <label for={`b-measure-${i}`}>Measure</label>
        <input id={`b-measure-${i}`} type="text" bind:value={b.measure} />
      </div>
      <div class="field">
        <label for={`b-score-${i}`}>Score</label>
        <input id={`b-score-${i}`} type="text" bind:value={b.score} placeholder="e.g. 42% / 28 WCPM" />
      </div>
      <div class="field" style="grid-column: span 2;">
        <label for={`b-date-${i}`}>Date / period</label>
        <input id={`b-date-${i}`} type="text" bind:value={b.date} placeholder="e.g. fall of current IEP year" />
      </div>
      <div class="field">
        <button class="btn small" on:click={() => removeBaseline(i)}>Remove</button>
      </div>
    </div>
  {/each}
  <button class="btn small" on:click={addBaseline}>+ Add baseline</button>
</Section>
