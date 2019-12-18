<script>
  import Peer from "peerjs";
  import { onMount } from "svelte";
  import { navigateTo } from "yrv";
  import Card from "../components/Card.svelte";
  import Button from "../components/Button.svelte";
  import Id from "../components/Id.svelte";

  export let router = {};
  const roomId = router.params.roomId;
  const roomName = router.query.name;
  const playerName = window.localStorage.getItem("nickname");
  const peer = new Peer();

  let playerId = "";
  let connection = {};
  let cardType = null;
  let matchRunning = false;

  onMount(() => {
    connection = peer.connect(roomId, {
      metadata: {
        playerName,
        roomName,
        roomId
      }
    });

    connection.on("open", () => {
      connection.on("data", data => {
        console.log("receiving data from owner", data);

        if (data.type === "CARD_DEALT") {
          cardType = data.payload;
        }

        if (data.type === "MATCH_STARTED") {
          matchRunning = true;
        }

        if (data.type === "MATCH_RUNNING") {
          matchRunning = !!data.payload;
        }

        if (data.type === "MATCH_STOPPED") {
          matchRunning = false;
        }
      });

      connection.on("close", () => {
        console.log("joiner the player was closed", connection.peer);
      });

      connection.on("disconnected", () => {
        console.log("joiner the player was disconnected", connection.peer);
      });

      connection.send("hello!!");
      connection.send({
        type: "PLAYER_JOINED"
      });
    });
  });

  function handleLeaveRoom() {
    connection.close();
    navigateTo("/", { replace: true });
  }
</script>

<style>
  .room {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 345px 1fr 1fr;
    grid-row-gap: 10px;
    justify-items: center;
    align-items: center;
  }

  .room h3 {
    font-weight: bold;
    font-size: 20px;
    text-align: center;
  }
</style>

<main class="room">
  <div>
    <Id {playerName} {roomName} />
  </div>

  <div>
    <Card type={cardType} />
  </div>

  <div>
    {#if !matchRunning}
      <h3>Waiting for your turn...</h3>
    {/if}
  </div>

  <div>
    <Button on:click={handleLeaveRoom}>Exit game</Button>
  </div>
</main>
