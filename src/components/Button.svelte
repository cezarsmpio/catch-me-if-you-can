<script>
  export let type;
</script>

<style>
  .button {
    padding: 13px 15px;

    font-size: 20px;
    font-weight: 700;
    color: var(--light);
    text-transform: uppercase;
    font-family: var(--base-font-family);

    background-color: var(--purple);
    border: 0;
    border-radius: 8px;
  }
</style>

<button class="button" on:click {type}>
  <slot />
</button>
