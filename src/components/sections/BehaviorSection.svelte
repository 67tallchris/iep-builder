<script>
  import Section from '../Section.svelte';
  import AiBox from '../AiBox.svelte';
  import ListEditor from '../ListEditor.svelte';
  import { draft, updateDraft, settings } from '../../lib/store.js';
  import { generate } from '../../lib/ai.js';

  $: aiReady = !!$settings.apiKey || !!$settings.baseUrl;
  const setList = (key) => (items) => updateDraft((d) => { d.behaviorPlan[key] = items; });

  function enable() {
    updateDraft((d) => {
      d.behaviorPlan.enabled = true;
      if (!d.specialFactors.behavior) {
        d.specialFactors.behavior = 'Behavior impedes the student’s learning or the learning of others. Positive behavioral interventions and supports are included, with progress monitoring described in the behavior support plan.';
      }
    });
  }
  function disable() {
    updateDraft((d) => { d.behaviorPlan.enabled = false; });
  }
  async function aiBehavior(notes) {
    return generate('behavior', $draft, { notes });
  }
  function applyBehavior(text) {
    updateDraft((d) => { d.behaviorPlan.monitoring = text; });
  }
</script>

<Section id="behavior" title="6 · Behavior Support Plan (when behavior impedes learning)">
  {#if !$draft.behaviorPlan.enabled}
    <p class="muted">
      Use this section when behavior impedes the student's learning or that of others. It builds a function-based
      plan (FBA → BSP) and links the behavior special factor to progress monitoring.
    </p>
    <button class="btn small primary" on:click={enable}>Enable behavior support plan</button>
  {:else}
    <div class="section-head" style="margin-top:-6px;">
      <span class="muted">Positive supports first. Restraint/seclusion is emergency-only under A.R.S. §15-105.</span>
      <div class="row">
        <AiBox
          label="Draft BSP summary"
          onGenerate={aiBehavior}
          applyLabel="Apply to monitoring"
          onApply={applyBehavior}
          disabled={!aiReady}
        />
        <button class="btn small" on:click={disable}>Disable</button>
      </div>
    </div>

    <div class="field">
      <label for="bsp-target">Target behavior (operational definition)</label>
      <textarea id="bsp-target" bind:value={$draft.behaviorPlan.targetBehavior}></textarea>
    </div>
    <div class="grid-2">
      <div class="field">
        <label for="bsp-base">Baseline data</label>
        <input id="bsp-base" type="text" bind:value={$draft.behaviorPlan.baseline} placeholder="e.g. 3–4 incidents/week" />
      </div>
      <div class="field">
        <label for="bsp-func">Hypothesized function</label>
        <input id="bsp-func" type="text" bind:value={$draft.behaviorPlan.function} placeholder="e.g. escape from difficult tasks" />
      </div>
    </div>

    <h3>Antecedent / prevention strategies</h3>
    <ListEditor items={$draft.behaviorPlan.antecedents} placeholder="e.g. 2-minute warning before transitions" onChange={setList('antecedents')} />

    <hr class="separator" />
    <h3>Replacement behaviors taught</h3>
    <ListEditor items={$draft.behaviorPlan.replacements} placeholder="e.g. Use a break card and take 2 minutes" onChange={setList('replacements')} />

    <hr class="separator" />
    <h3>Consequence strategies</h3>
    <ListEditor items={$draft.behaviorPlan.consequences} placeholder="e.g. Specific praise for using the replacement behavior" onChange={setList('consequences')} />

    <hr class="separator" />
    <div class="grid-2">
      <div class="field">
        <label for="bsp-crisis">Crisis / safety plan</label>
        <textarea id="bsp-crisis" bind:value={$draft.behaviorPlan.crisis} placeholder="Stage-based de-escalation; restraint/seclusion only for imminent danger with same-day parent notice."></textarea>
      </div>
      <div class="field">
        <label for="bsp-monitor">Progress monitoring</label>
        <textarea id="bsp-monitor" bind:value={$draft.behaviorPlan.monitoring}></textarea>
      </div>
    </div>
    <h3>Staff responsibilities</h3>
    <ListEditor items={$draft.behaviorPlan.staff} placeholder="e.g. Teacher: implement antecedent supports and data collection" onChange={setList('staff')} />
  {/if}
</Section>
