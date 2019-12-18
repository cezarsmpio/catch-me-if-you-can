<script>
  import { Router, Route } from "yrv";
  import Index from "./pages/Index.svelte";
  import Room from "./pages/Room.svelte";
  import JoinRoom from "./pages/JoinRoom.svelte";

  export let url = "";
</script>

<style>
  :global(:root) {
    --text: #000;
    --light: #fff;
    --dark: #000;
    --purple: #5e5be1;
    --bg: #98e8b3;
    --base-font-family: Poppins, Arial, sans-serif;
    --base-font-size: 16px;
    --base-font-weight: 400;
  }

  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-size: var(--base-font-size);
    font-family: var(--base-font-family);
    font-weight: var(--base-font-weight);
    color: var(--dark);
    background-color: var(--bg);
  }

  .root {
    height: 100vh;
    padding: 30px;
  }
</style>

<Router {url}>
  <div class="root">
    <Route exact path="/join/:roomId" component={JoinRoom} />
    <Route exact path="/room/:roomId" component={Room} />
    <Route exact path="/" component={Index} />
  </div>
</Router>
