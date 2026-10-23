<script>
  export let checks = [];

  $: fails = checks.filter((c) => !c.ok && c.severity === 'fail');
  $: warns = checks.filter((c) => !c.ok && c.severity === 'warn');
  $: passes = checks.filter((c) => c.ok);

  function go(section) {
    document.getElementById(`section-${section}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
</script>

<aside class="card panel">
  <h2>Compliance check</h2>
  <p class="muted">Rules from AZ-TAS 2025 and Arizona statute. Drafts are aids, not legal advice.</p>
  <div class="row" style="margin-bottom:10px;">
    <span class="pill fail">{fails.length} to fix</span>
    <span class="pill warn">{warns.length} warnings</span>
    <span class="pill ok">{passes.length} passing</span>
  </div>

  {#if fails.length}
    <h3>Must fix</h3>
    {#each fails as c (c.id)}
      <div class="check fail" role="button" tabindex="0" on:click={() => go(c.section)} on:keydown={(e) => e.key === 'Enter' && go(c.section)}>
        <div>{c.message}</div>
        <div class="where">{c.section}</div>
      </div>
    {/each}
  {/if}

  {#if warns.length}
    <h3 style="margin-top:12px;">Review</h3>
    {#each warns as c (c.id)}
      <div class="check warn" role="button" tabindex="0" on:click={() => go(c.section)} on:keydown={(e) => e.key === 'Enter' && go(c.section)}>
        <div>{c.message}</div>
        <div class="where">{c.section}</div>
      </div>
    {/each}
  {/if}

  {#if !fails.length && !warns.length}
    <div class="check ok">All checks passing. Review the content with the IEP team.</div>
  {/if}

  <hr class="separator" />
  <details>
    <summary class="muted">Passing checks ({passes.length})</summary>
    {#each passes as c (c.id)}
      <div class="check ok">{c.message}</div>
    {/each}
  </details>
</aside>
