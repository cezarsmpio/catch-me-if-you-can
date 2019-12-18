<script>
  export let type = "text";
  export let name;
  export let required;
  export let placeholder;
  export let autofocus;
  export let value = "";

  function handleInput(evt) {
    value = type.match(/^(number|range)$/)
      ? +evt.target.value
      : evt.target.value;
  }
</script>

<style>
  input {
    width: 100%;
    padding: 16px 20px;

    font-size: var(--base-font-size);
    font-family: var(--base-font-family);
    color: var(--purple);
    text-align: center;

    border-radius: 8px;
    border: 0;
  }
</style>

<input
  {type}
  {name}
  {required}
  {placeholder}
  {autofocus}
  on:input={handleInput}
  {value} />
