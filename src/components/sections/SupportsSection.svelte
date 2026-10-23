<script>
  import Section from '../Section.svelte';
  import ListEditor from '../ListEditor.svelte';
  import { draft, updateDraft } from '../../lib/store.js';

  const setList = (key) => (items) => updateDraft((d) => { d[key] = items; });
</script>

<Section id="supports" title="5 · Supports & Special Factors">
  <h3>Supplementary aids and services</h3>
  <p class="muted">Supports that enable participation in general education, extracurricular, and nonacademic settings.</p>
  <ListEditor items={$draft.supplementaryAids} placeholder="e.g. Graphic organizers for reading tasks" onChange={setList('supplementaryAids')} />

  <hr class="separator" />

  <h3>Accommodations</h3>
  <p class="muted">Access and demonstration supports that do not change content level or criteria.</p>
  <ListEditor items={$draft.accommodations} placeholder="e.g. Extended time on assessments" onChange={setList('accommodations')} />

  <hr class="separator" />

  <h3>Program modifications</h3>
  <p class="muted">Changes to what the student is expected to learn or demonstrate (e.g., modified grading scale, reduced content for mastery).</p>
  <ListEditor items={$draft.modifications} placeholder="e.g. Modified grading scale aligned to IEP goals" onChange={setList('modifications')} />

  <hr class="separator" />

  <h3>Supports for school personnel</h3>
  <p class="muted">Training, consultation, coaching, or aide supports staff need to implement the IEP.</p>
  <ListEditor items={$draft.personnelSupports} placeholder="e.g. Training on the student's AAC device" onChange={setList('personnelSupports')} />

  <hr class="separator" />

  <h3>Special factors considered</h3>
  <div class="grid-2">
    <div class="field">
      <label for="sf-at">Assistive technology</label>
      <textarea id="sf-at" bind:value={$draft.specialFactors.at}></textarea>
    </div>
    <div class="field">
      <label for="sf-comm">Communication needs</label>
      <textarea id="sf-comm" bind:value={$draft.specialFactors.communication}></textarea>
    </div>
    <div class="field">
      <label for="sf-beh">Behavior (link to the behavior plan if used)</label>
      <textarea id="sf-beh" bind:value={$draft.specialFactors.behavior}></textarea>
    </div>
    <div class="field">
      <label for="sf-lep">Limited English proficiency</label>
      <textarea id="sf-lep" bind:value={$draft.specialFactors.lep}></textarea>
    </div>
    <div class="field">
      <label for="sf-deaf">Deaf / hearing impaired</label>
      <textarea id="sf-deaf" bind:value={$draft.specialFactors.deafHI}></textarea>
    </div>
    <div class="field">
      <label for="sf-blind">Blind / visually impaired</label>
      <textarea id="sf-blind" bind:value={$draft.specialFactors.blindVI}></textarea>
    </div>
  </div>
</Section>
