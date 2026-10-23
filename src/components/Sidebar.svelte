<script>
  import { draft, updateDraft, newGoal, newService } from '../lib/store.js';

  export let examples = [];
  export let snippets = [];
  export let onUseExemplar = () => {};

  let tab = 'exemplars';
  let bandFilter = '';
  let categoryFilter = '';
  let snippetQuery = '';
  let snippetComponent = '';
  let selectedId = null;
  let copied = '';

  $: categories = [...new Set(examples.map((e) => e.az_category).filter(Boolean))].sort();
  $: filteredExamples = examples.filter(
    (e) => (!bandFilter || e.grade_band === bandFilter) && (!categoryFilter || e.az_category === categoryFilter)
  );
  $: components = [...new Set(snippets.map((s) => s.component))].sort();
  $: filteredSnippets = snippets
    .filter((s) => (!snippetComponent || s.component === snippetComponent))
    .filter((s) => !snippetQuery || (s.text || '').toLowerCase().includes(snippetQuery.toLowerCase()))
    .slice(0, 60);

  function copy(text, id) {
    navigator.clipboard?.writeText(text);
    copied = id;
    setTimeout(() => (copied = ''), 1500);
  }

  function addTo(key, text) {
    updateDraft((d) => { d[key] = [...d[key], text]; });
    copied = 'added';
    setTimeout(() => (copied = ''), 1200);
  }

  function addServiceFromSnippet(s) {
    updateDraft((d) => {
      d.services.push({ ...newService(), type: s.text });
    });
  }

  function addGoalFromSnippet(s) {
    updateDraft((d) => {
      const g = newGoal();
      g.area = 'New goal (template)';
      g.skill = s.text;
      d.goals.push(g);
    });
  }

  function addBehaviorSnippet(s) {
    updateDraft((d) => {
      d.behaviorPlan.enabled = true;
      if (s.component === 'behavior_antecedent_stem') d.behaviorPlan.antecedents = [...d.behaviorPlan.antecedents, s.text];
      else if (s.component === 'behavior_replacement_stem') d.behaviorPlan.replacements = [...d.behaviorPlan.replacements, s.text];
      else if (s.component === 'behavior_consequence_stem') d.behaviorPlan.consequences = [...d.behaviorPlan.consequences, s.text];
      else if (s.component === 'crisis_plan_stem') d.behaviorPlan.crisis = s.text;
    });
  }

  function snippetAction(s) {
    switch (s.component) {
      case 'accommodation': addTo('accommodations', s.text); break;
      case 'supplementary_aid': addTo('supplementaryAids', s.text); break;
      case 'program_modification': addTo('modifications', s.text); break;
      case 'personnel_support': addTo('personnelSupports', s.text); break;
      case 'service_type': addServiceFromSnippet(s); break;
      case 'goal_frame': addGoalFromSnippet(s); break;
      case 'behavior_antecedent_stem':
      case 'behavior_replacement_stem':
      case 'behavior_consequence_stem':
      case 'crisis_plan_stem': addBehaviorSnippet(s); break;
      default: copy(s.text, s.id);
    }
  }

  function actionLabel(s) {
    switch (s.component) {
      case 'accommodation': return 'Add';
      case 'supplementary_aid': return 'Add';
      case 'program_modification': return 'Add';
      case 'personnel_support': return 'Add';
      case 'service_type': return 'Add service';
      case 'goal_frame': return 'New goal';
      case 'behavior_antecedent_stem':
      case 'behavior_replacement_stem':
      case 'behavior_consequence_stem':
      case 'crisis_plan_stem': return 'Add to BSP';
      default: return 'Copy';
    }
  }
</script>

<aside class="card panel">
  <div class="tabs">
    <button class:active={tab === 'exemplars'} on:click={() => (tab = 'exemplars')}>Exemplars ({examples.length})</button>
    <button class:active={tab === 'snippets'} on:click={() => (tab = 'snippets')}>Snippets ({snippets.length})</button>
  </div>

  {#if tab === 'exemplars'}
    <div class="filter-row">
      <select bind:value={bandFilter} aria-label="Filter by grade band">
        <option value="">All bands</option>
        <option value="elementary">Elementary</option>
        <option value="middle">Middle</option>
      </select>
      <select bind:value={categoryFilter} aria-label="Filter by category">
        <option value="">All categories</option>
        {#each categories as c}<option value={c}>{c}</option>{/each}
      </select>
    </div>
    <p class="muted">Click a profile to preview. Loading one replaces the current draft.</p>
    {#each filteredExamples as e}
      <div
        class="ex-item"
        class:selected={selectedId === e.id}
        role="button"
        tabindex="0"
        on:click={() => (selectedId = selectedId === e.id ? null : e.id)}
        on:keydown={(ev) => ev.key === 'Enter' && (selectedId = e.id)}
      >
        <div class="t">{e.title}</div>
        <div class="muted" style="font-size:0.75rem;">{e.grade_band} · {e.az_category}{e.behavior_support_plan ? ' · BSP' : ''}</div>
        {#if selectedId === e.id}
          <div style="margin-top:6px;" class="row">
            <button class="btn small primary" on:click|stopPropagation={() => onUseExemplar(e)}>Use as starting point</button>
            <button class="btn small" on:click|stopPropagation={() => copy(JSON.stringify(e, null, 2), e.id)}>Copy JSON</button>
          </div>
          <p class="muted" style="margin-top:6px;">{e.plaafp?.academic?.slice(0, 180)}…</p>
        {/if}
      </div>
    {/each}
  {:else}
    <div class="field">
      <input type="text" bind:value={snippetQuery} placeholder="Search snippets…" aria-label="Search snippets" />
    </div>
    <div class="field">
      <select bind:value={snippetComponent} aria-label="Filter by component">
        <option value="">All components</option>
        {#each components as c}<option value={c}>{c}</option>{/each}
      </select>
    </div>
    {#each filteredSnippets as s (s.id)}
      <div class="snippet">
        <div class="meta">{s.component.replaceAll('_', ' ')}</div>
        <div class="txt">{s.text}</div>
        <div class="row">
          <button class="btn small" on:click={() => snippetAction(s)}>{actionLabel(s)}</button>
          <button class="btn small" on:click={() => copy(s.text, s.id)}>{copied === s.id ? 'Copied!' : 'Copy'}</button>
        </div>
      </div>
    {/each}
  {/if}
  {#if copied === 'added'}<p class="muted">Added to draft.</p>{/if}
</aside>
