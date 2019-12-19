<script>
  import Peer from "peerjs";
  import { onMount } from "svelte";
  import { navigateTo } from "yrv";
  import Card from "../components/Card.svelte";
  import Button from "../components/Button.svelte";
  import Id from "../components/Id.svelte";
  import { getOriginalRoomName } from "../utils/room";

  export let router = {};
  const roomId = router.params.roomId;
  const roomName = getOriginalRoomName(roomId);
  const playerName = window.localStorage.getItem("nickname");
  const peer = new Peer();

  let playerId = "";
  let connection = {};
  let cardType = null;
  let matchRunning = false;
  let connectionFailed = false;
  let estabilisingConnection = true;

  onMount(() => {
    if (!playerName || !roomName) {
      navigateTo("/", { replace: true });
    }

    connection = peer.connect(roomId, {
      metadata: {
        playerName,
        roomName,
        roomId
      }
    });

    const checkConnection = setTimeout(() => {
      estabilisingConnection = false;
      connectionFailed = true;
    }, 5000);

    connection.on("open", () => {
      clearTimeout(checkConnection);
      connectionFailed = false;
      estabilisingConnection = false;

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

        connectionFailed = true;
      });

      connection.on("disconnected", () => {
        console.log("joiner the player was disconnected", connection.peer);

        connectionFailed = true;
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
  .connecting {
    text-align: center;
  }

  .connection-failed {
    text-align: center;
  }

  .connection-failed h1 {
    margin-bottom: 30px;
  }

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

{#if estabilisingConnection}
  <div class="connecting">
    <h1>Trying to connect...</h1>
  </div>
{:else}
  {#if connectionFailed}
    <div class="connection-failed">
      <h1>We couldn't find a room :(</h1>

      <Button on:click={handleLeaveRoom}>New game</Button>
    </div>
  {:else}
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
  {/if}
{/if}
