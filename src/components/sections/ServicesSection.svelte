<script>
  import Section from '../Section.svelte';
  import { draft, updateDraft, newService } from '../../lib/store.js';

  function addService() {
    updateDraft((d) => d.services.push(newService()));
  }
  function duplicate(i) {
    updateDraft((d) => d.services.splice(i + 1, 0, { ...structuredClone(d.services[i]), id: crypto.randomUUID() }));
  }
  function remove(i) {
    updateDraft((d) => d.services.splice(i, 1));
  }
</script>

<Section id="services" title="4 · Special Education, Related Services & Supplementary Aids">
  <div class="section-head" style="margin-top:-6px;">
    <span class="muted">Every service needs five dimensions: type, frequency, duration, location, provider.</span>
    <button class="btn small primary" on:click={addService}>+ Add service</button>
  </div>

  {#if !$draft.services.length}
    <p class="muted">No services yet. Common types: SDI in reading/math/writing, counseling, speech-language, OT/PT, consultation.</p>
  {/if}

  {#each $draft.services as s, i (s.id)}
    <div class="service">
      <div class="row" style="justify-content:space-between;">
        <strong>Service {i + 1}</strong>
        <div class="row">
          <button class="btn small" on:click={() => duplicate(i)}>Duplicate</button>
          <button class="btn small" on:click={() => remove(i)}>Remove</button>
        </div>
      </div>
      <div class="field" style="margin-top:8px;">
        <label for={`s-type-${i}`}>Type</label>
        <input id={`s-type-${i}`} type="text" bind:value={s.type} placeholder="e.g. Special education — reading (SDI)" />
      </div>
      <div class="grid-3">
        <div class="field">
          <label for={`s-freq-${i}`}>Frequency</label>
          <input id={`s-freq-${i}`} type="text" bind:value={s.frequency} placeholder="e.g. 4x/week" />
        </div>
        <div class="field">
          <label for={`s-dur-${i}`}>Duration</label>
          <input id={`s-dur-${i}`} type="text" bind:value={s.duration} placeholder="e.g. 45 minutes" />
        </div>
        <div class="field">
          <label for={`s-loc-${i}`}>Location</label>
          <input id={`s-loc-${i}`} type="text" bind:value={s.location} placeholder="e.g. Resource room" />
        </div>
      </div>
      <div class="field">
        <label for={`s-prov-${i}`}>Provider</label>
        <input id={`s-prov-${i}`} type="text" bind:value={s.provider} placeholder="e.g. Special education teacher" />
      </div>
    </div>
  {/each}
</Section>
