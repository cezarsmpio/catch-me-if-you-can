<script>
  import Peer from "peerjs";
  import shuffle from "lodash.shuffle";
  import { CARDS } from "../components/Card.svelte";

  const peer = new Peer();

  let myId = "";
  let joiner = {};
  let playersInTheRoom = {};
  let connection = {};
  let [, roomHash = "new"] = window.location.hash.split("#");
  let iAm = null;
  let matchRunning = false;

  $: isOwner = roomHash === "new";
  $: numberOfPlayers = Object.keys(playersInTheRoom).length;

  // Connects to the server
  peer.on("open", id => {
    console.log("my id is", id);
    myId = id;

    playersInTheRoom = {
      ...playersInTheRoom,
      [id]: peer
    };
  });

  $: console.log(playersInTheRoom);

  // Someone joins the room
  peer.on("connection", conn => {
    console.log("the player has joined", conn.peer);

    conn.on("open", () => {
      console.log("the player has opened connection", conn.peer);

      conn.on("data", data => {
        console.log("peer1 is receiving data", data);

        if (data.type === "PLAYER_JOINED") {
          playersInTheRoom = {
            ...playersInTheRoom,
            [conn.peer]: conn
          };
        }
      });

      conn.on("close", () => {
        console.log("the player was closed", conn.peer);

        kickPlayerFromRoom(conn.peer);
      });

      conn.on("disconnected", () => {
        console.log("the player was disconnected", conn.peer);
      });

      conn.send("from the owner, hi!");
      conn.send({
        type: "MATCH_RUNNING",
        payload: !!matchRunning
      });
    });
  });

  function sendToAll(message) {
    Object.keys(playersInTheRoom).forEach(peerKey => {
      const player = playersInTheRoom[peerKey];

      if (player.send && player.open) {
        player.send(message);
      }
    });
  }

  function handleNewGame() {
    const cardsToPlayers = distributeCards();

    sendCardsToPlayers(cardsToPlayers);

    iAm = cardsToPlayers[myId];
    matchRunning = true;
    sendToAll({
      type: "MATCH_STARTED"
    });
  }

  function handleStopGame() {
    iAm = null;
    matchRunning = false;
    sendToAll({
      type: "MATCH_STOPPED"
    });
    sendCardsToPlayers({});
  }

  function distributeCards() {
    // if (numberOfPlayers < 3) {
    // 	throw new Error('A game can only start with at least 3 players.');
    // }

    return shuffle(Object.keys(playersInTheRoom)).reduce(
      (list, playerId, index) => {
        list[playerId] = index <= 1 ? CARDS[index] : CARDS[2];

        return list;
      },
      {}
    );
  }

  function sendCardsToPlayers(cards) {
    Object.keys(playersInTheRoom).forEach(peerKey => {
      const player = playersInTheRoom[peerKey];

      if (player.send && player.open) {
        player.send({
          type: "CARD_DEALT",
          payload: cards[peerKey]
        });
      }
    });
  }

  function kickPlayerFromRoom(id) {
    playersInTheRoom = Object.keys(playersInTheRoom).reduce((list, peerKey) => {
      if (id !== peerKey) {
        list[peerKey] = playersInTheRoom[peerKey];
      }

      return list;
    }, {});
  }
</script>

{#if !matchRunning}
  <button on:click={handleNewGame}>New game</button>
{:else}
  <button on:click={handleStopGame}>Stop turn</button>
{/if}

<p>Invite your friends: {myId}</p>

<p>Players: {numberOfPlayers}</p>

{#if iAm}
  <p>You are: {iAm}</p>
{/if}

{#if matchRunning && !iAm}
  <p>There is match going on! Wait your turn.</p>
{/if}
