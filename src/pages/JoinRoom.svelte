<script>
  import { navigateTo } from "yrv";
  import { onMount } from "svelte";
  import Input from "../components/Input.svelte";
  import Button from "../components/Button.svelte";

  export let router = {};
  const roomId = router.params.roomId;
  const roomName = router.query.name;

  let nickname = window.localStorage.getItem("nickname");

  onMount(() => {
    if (!roomName) {
      navigateTo("/", { replace: true });
    }
  });

  function handleOnSubmit(evt) {
    evt.preventDefault();

    window.localStorage.setItem("nickname", nickname);

    navigateTo(`/room/${roomId}`, {
      queryParams: {
        name: roomName
      }
    });
  }
</script>

<style>
  .join-room {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    justify-items: center;
    align-items: center;
  }

  .join-room__welcome {
    color: var(--purple);
    font-size: 20px;
    font-weight: 700;
    text-align: center;
  }

  .join-room__room-name {
    color: var(--purple);
    font-size: 44px;
    font-weight: 700;
    text-align: center;
    line-height: 1.1;
    letter-spacing: -3px;
  }

  .join-room > div:nth-child(2) {
    align-self: flex-start;

    text-align: center;
  }

  .join-room__form-group {
    margin-bottom: 15px;
  }
</style>

{@debug nickname}

<main class="join-room">
  <div>
    <h3 class="join-room__welcome">Welcome to the room</h3>
    <h2 class="join-room__room-name">{roomName}</h2>
  </div>

  <div>
    <form method="post" class="join-room__form" on:submit={handleOnSubmit}>
      <div class="join-room__form-group">
        <Input
          name="nickname"
          bind:value={nickname}
          placeholder="Your nickname"
          autofocus />
      </div>
      <Button type="submit">Join the game!</Button>
    </form>
  </div>
</main>
