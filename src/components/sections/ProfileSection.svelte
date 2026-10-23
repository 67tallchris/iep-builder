<script>
  import Section from '../Section.svelte';
  import { draft } from '../../lib/store.js';

  const categories = [
    'Specific Learning Disability',
    'Emotional Disability',
    'Other Health Impairment',
    'Autism',
    'Speech/Language Impairment',
    'Mild Intellectual Disability',
    'Moderate Intellectual Disability',
    'Severe Intellectual Disability',
    'Multiple Disabilities',
    'Orthopedic Impairment',
    'Hearing Impairment',
    'Visual Impairment',
    'Traumatic Brain Injury',
    'Developmental Delay'
  ];
  const bands = ['elementary', 'middle', 'high'];

  $: isSLD = $draft.profile.category === 'Specific Learning Disability';
</script>

<Section id="profile" title="1 · Student & Meeting Information">
  <div class="grid-2">
    <div class="field">
      <label for="draft-title">Draft title</label>
      <input id="draft-title" type="text" bind:value={$draft.title} placeholder="e.g. Grade 4 SLD reading draft" />
    </div>
    <div class="field">
      <label for="student-label">Student label (never a real name)</label>
      <input id="student-label" type="text" bind:value={$draft.profile.studentLabel} />
    </div>
  </div>

  <div class="grid-3">
    <div class="field">
      <label for="grade">Grade</label>
      <input id="grade" type="text" bind:value={$draft.profile.grade} placeholder="e.g. 4" />
    </div>
    <div class="field">
      <label for="band">Grade band</label>
      <select id="band" bind:value={$draft.profile.gradeBand}>
        <option value="">Select…</option>
        {#each bands as b}<option value={b}>{b}</option>{/each}
      </select>
    </div>
    <div class="field">
      <label for="meeting">Meeting date</label>
      <input id="meeting" type="date" bind:value={$draft.profile.meetingDate} />
    </div>
  </div>

  <div class="grid-2">
    <div class="field">
      <label for="category">Primary eligibility category</label>
      <select id="category" bind:value={$draft.profile.category}>
        <option value="">Select…</option>
        {#each categories as c}<option value={c}>{c}</option>{/each}
      </select>
    </div>
    <div class="field">
      <label for="secondary">Secondary category (optional)</label>
      <select id="secondary" bind:value={$draft.profile.secondaryCategory}>
        <option value="">None</option>
        {#each categories as c}<option value={c}>{c}</option>{/each}
      </select>
    </div>
  </div>

  {#if isSLD}
    <div class="field" style="border:1px solid #f3c98b; background:#fffaf0; border-radius:8px; padding:10px;">
      <label for="dyslexia">Dyslexia diagnosis documented? (required for SLD in Arizona — A.R.S. §15-763)</label>
      <div class="row" id="dyslexia">
        <label style="font-weight:400; display:flex; gap:6px; align-items:center;">
          <input type="radio" value={true} bind:group={$draft.profile.dyslexiaDiagnosis} /> Yes
        </label>
        <label style="font-weight:400; display:flex; gap:6px; align-items:center;">
          <input type="radio" value={false} bind:group={$draft.profile.dyslexiaDiagnosis} /> No
        </label>
        <label style="font-weight:400; display:flex; gap:6px; align-items:center;">
          <input type="radio" value={null} bind:group={$draft.profile.dyslexiaDiagnosis} /> Not answered
        </label>
      </div>
    </div>
  {/if}

  <div class="grid-2">
    <div class="field">
      <label for="start">IEP start date</label>
      <input id="start" type="date" bind:value={$draft.profile.iepStart} />
    </div>
    <div class="field">
      <label for="end">IEP end date</label>
      <input id="end" type="date" bind:value={$draft.profile.iepEnd} />
    </div>
  </div>

  <p class="muted">This tool must never contain real student data. Use fictional labels and de-identified notes only.</p>
</Section>
