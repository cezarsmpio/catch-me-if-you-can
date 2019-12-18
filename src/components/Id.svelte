<script>
  export let playerName = "";
  export let roomName = "";
</script>

<style>
  .id {
    text-align: center;
    font-size: 14px;
    line-height: 21px;
    font-weight: 700;
  }

  .id span {
    display: inline-block;
    padding: 5px 15px;

    background: var(--light);
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
  }
</style>

<p class="id">
  <span>{playerName} - {roomName}</span>
</p>
