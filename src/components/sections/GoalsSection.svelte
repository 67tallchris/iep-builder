<script>
  import Section from '../Section.svelte';
  import { draft, updateDraft, newGoal, settings } from '../../lib/store.js';
  import { generateGoal } from '../../lib/ai.js';

  $: aiReady = !!$settings.apiKey || !!$settings.baseUrl;

  let aiNotes = {};
  let aiBusy = {};
  let aiError = {};

  function addGoal() {
    updateDraft((d) => d.goals.push(newGoal()));
  }
  function duplicate(i) {
    updateDraft((d) => {
      d.goals.splice(i + 1, 0, { ...structuredClone(d.goals[i]), id: crypto.randomUUID() });
    });
  }
  function remove(i) {
    updateDraft((d) => d.goals.splice(i, 1));
  }
  async function draftGoal(i) {
    aiBusy = { ...aiBusy, [i]: true };
    aiError = { ...aiError, [i]: '' };
    try {
      const fields = await generateGoal($draft, { area: $draft.goals[i].area, notes: aiNotes[i] || '' });
      updateDraft((d) => Object.assign(d.goals[i], fields));
    } catch (e) {
      aiError = { ...aiError, [i]: e.message || String(e) };
    } finally {
      aiBusy = { ...aiBusy, [i]: false };
    }
  }
  function addBenchmarkHint() {}
</script>

<Section id="goals" title="3 · Measurable Annual Goals">
  <div class="section-head" style="margin-top:-6px;">
    <span class="muted">Each goal needs a specific skill, baseline, target, measurement method, and schedule (SMART).</span>
    <button class="btn small primary" on:click={addGoal}>+ Add goal</button>
  </div>

  {#if !$draft.goals.length}
    <p class="muted">No goals yet. Add one, or load an exemplar from the left panel and adapt its goals.</p>
  {/if}

  {#each $draft.goals as g, i (g.id)}
    <div class="goal">
      <div class="row" style="justify-content:space-between;">
        <strong>Goal {i + 1}</strong>
        <div class="row">
          <button class="btn small" disabled={!aiReady || aiBusy[i]} on:click={() => draftGoal(i)}>
            {aiBusy[i] ? 'Drafting…' : '✨ Draft wording'}
          </button>
          <button class="btn small" on:click={() => duplicate(i)}>Duplicate</button>
          <button class="btn small" on:click={() => remove(i)}>Remove</button>
        </div>
      </div>

      {#if aiReady}
        <div class="field" style="margin-top:8px;">
          <input
            type="text"
            placeholder="Notes for AI (skill area, current performance, materials)…"
            bind:value={aiNotes[i]}
          />
        </div>
        {#if aiError[i]}<p class="muted" style="color:var(--fail)">{aiError[i]}</p>{/if}
      {/if}

      <div class="grid-2">
        <div class="field">
          <label for={`g-area-${i}`}>Goal area</label>
          <input id={`g-area-${i}`} type="text" bind:value={g.area} placeholder="e.g. Reading — decoding" />
        </div>
        <div class="field">
          <label for={`g-sched-${i}`}>Measurement schedule</label>
          <input id={`g-sched-${i}`} type="text" bind:value={g.schedule} placeholder="e.g. weekly probes; quarterly reporting" />
        </div>
      </div>
      <div class="field">
        <label for={`g-cond-${i}`}>Condition / context</label>
        <textarea id={`g-cond-${i}`} bind:value={g.condition} style="min-height:56px;"></textarea>
      </div>
      <div class="field">
        <label for={`g-skill-${i}`}>Specific skill or behavior</label>
        <textarea id={`g-skill-${i}`} bind:value={g.skill} style="min-height:56px;"></textarea>
      </div>
      <div class="grid-2">
        <div class="field">
          <label for={`g-base-${i}`}>Baseline (include data)</label>
          <input id={`g-base-${i}`} type="text" bind:value={g.baseline} />
        </div>
        <div class="field">
          <label for={`g-target-${i}`}>Target / mastery criterion</label>
          <input id={`g-target-${i}`} type="text" bind:value={g.target} />
        </div>
      </div>
      <div class="field">
        <label for={`g-meas-${i}`}>Measurement method</label>
        <input id={`g-meas-${i}`} type="text" bind:value={g.measurement} />
      </div>
      <div class="field">
        <label for={`g-bench-${i}`}>Benchmarks / short-term objectives (required only for alternate assessment)</label>
        <textarea id={`g-bench-${i}`} bind:value={g.benchmarks} style="min-height:56px;"></textarea>
      </div>
    </div>
  {/each}
</Section>
