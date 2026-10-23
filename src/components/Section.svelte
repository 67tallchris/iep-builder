<script>
  export let id = '';
  export let title = '';
</script>

<section class="card section" id={`section-${id}`}>
  <div class="section-head">
    <h2>{title}</h2>
    <div class="actions"><slot name="actions" /></div>
  </div>
  <slot />
</section>
