<script context="module">
  import Clipboard from "clipboard";
</script>

<script>
  import { onMount } from "svelte";

  export let type = "button";
  export let clipboard = "";

  let button;

  onMount(() => {
    if (clipboard) {
      const clip = new Clipboard(button);
      const originalButtonText = button.innerText;

      clip.on("success", function(e) {
        button.innerText = "Copied!";

        setTimeout(() => {
          button.innerText = originalButtonText;
        }, 1000);
      });
    }
  });
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

<button
  class="button"
  bind:this={button}
  data-clipboard-text={clipboard}
  on:click
  {type}>
  <slot />
</button>
