<script>
  export let items = [];
  export let placeholder = 'Add item…';
  export let onChange = () => {};

  let value = '';

  function add() {
    const v = value.trim();
    if (!v) return;
    onChange([...items, v]);
    value = '';
  }

  function remove(i) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function onKey(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      add();
    }
  }
</script>

<div class="list-item">
  <input type="text" bind:value {placeholder} on:keydown={onKey} aria-label={placeholder} />
  <button class="btn small" on:click={add}>Add</button>
</div>
{#if items.length}
  <div class="chip-list">
    {#each items as item, i}
      <span class="chip">{item} <button title="Remove" on:click={() => remove(i)}>×</button></span>
    {/each}
  </div>
{/if}
