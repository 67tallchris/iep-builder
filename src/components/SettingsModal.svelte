<script>
  import { settings, MODEL_PRESETS } from '../lib/store.js';

  export let onClose = () => {};

  $: presets = MODEL_PRESETS[$settings.provider] || [];

  function syncModel() {
    if (presets.length && !presets.includes($settings.model)) {
      $settings.model = presets[0];
    }
  }

  function clearKey() {
    $settings.apiKey = '';
  }
</script>

<div class="modal-backdrop" role="dialog" aria-modal="true" aria-label="AI settings">
  <div class="modal">
    <div class="row" style="justify-content:space-between;">
      <h2 style="margin:0;">AI assist settings (BYOK)</h2>
      <button class="btn small" on:click={onClose}>Close</button>
    </div>
    <p class="muted">
      Your API key is stored only in this browser and sent directly to our Cloudflare proxy for each request.
      It is never stored on the server or logged.
    </p>

    <div class="field">
      <label for="provider">Provider</label>
      <select id="provider" bind:value={$settings.provider} on:change={syncModel}>
        <option value="anthropic">Anthropic (Claude)</option>
        <option value="openai">OpenAI</option>
        <option value="openai-compatible">OpenAI-compatible endpoint (OpenCode, local, etc.)</option>
      </select>
    </div>

    <div class="field">
      <label for="model">Model</label>
      {#if $settings.provider === 'openai-compatible'}
        <input id="model" type="text" bind:value={$settings.model} placeholder="model name" />
      {:else}
        <select id="model" bind:value={$settings.model}>
          {#each presets as m}<option value={m}>{m}</option>{/each}
        </select>
      {/if}
    </div>

    {#if $settings.provider === 'openai-compatible'}
      <div class="field">
        <label for="base">Base URL</label>
        <input id="base" type="text" bind:value={$settings.baseUrl} placeholder="https://your-endpoint.example/v1" />
      </div>
    {/if}

    <div class="field">
      <label for="key">API key</label>
      <input id="key" type="password" bind:value={$settings.apiKey} placeholder="sk-…" autocomplete="off" />
    </div>

    <div class="row">
      <button class="btn primary" on:click={onClose}>Done</button>
      <button class="btn" on:click={clearKey}>Clear key</button>
    </div>
    <p class="muted" style="margin-top:10px;">
      Without a key, all drafting features still work manually — AI assist buttons stay disabled.
      Never paste real student information into AI prompts.
    </p>
  </div>
</div>
