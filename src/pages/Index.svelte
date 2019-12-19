<script>
  import Peer from "peerjs";
  import shuffle from "lodash.shuffle";
  import { generateRoomId, getOriginalRoomName } from "../utils/room";
  import { CARDS } from "../components/Card.svelte";
  import Input from "../components/Input.svelte";
  import Button from "../components/Button.svelte";
  import Card from "../components/Card.svelte";
  import Id from "../components/Id.svelte";

  let peer;
  let playerName = window.localStorage.getItem("nickname");
  let roomId = window.localStorage.getItem("room");
  let roomName = getOriginalRoomName(window.localStorage.getItem("room"));
  let step = 1;
  let myId = "";
  let joiner = {};
  let playersInTheRoom = {};
  let connection = {};
  let cardType = null;
  let matchRunning = false;

  $: invitePlayersUrl = window.location.origin + "/join/" + roomId;
  $: numberOfPlayers = Object.keys(playersInTheRoom).length;

  function initOriginalPeer() {
    peer = new Peer(roomId);

    // Connects to the server
    peer.on("open", id => {
      console.log("my id is", id);
      myId = id;

      playersInTheRoom = {
        ...playersInTheRoom,
        [id]: peer
      };
    });

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
  }

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

    cardType = cardsToPlayers[myId];
    matchRunning = true;
    sendToAll({
      type: "MATCH_STARTED"
    });
  }

  function handleStopGame() {
    cardType = null;
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

  function handleOnRoomSubmit(evt) {
    evt.preventDefault();

    const inputRoomValue = evt.target.elements.room.value;
    const newRoomId = generateRoomId(inputRoomValue);
    const newRoomName = getOriginalRoomName(newRoomId);

    if (newRoomName !== roomName) {
      roomName = newRoomName;
      roomId = newRoomId;
      window.localStorage.setItem("room", newRoomId);
    }
    step = 2;
  }

  function handleOnNicknameSubmit(evt) {
    evt.preventDefault();

    const inputNicknameValue = evt.target.elements.nickname.value;

    playerName = inputNicknameValue;
    window.localStorage.setItem("nickname", inputNicknameValue);
    step = false;

    initOriginalPeer();
  }
</script>

<style>
  .home {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 440px 1fr;
  }

  .home__logo {
    position: relative;
  }

  .logo {
    position: absolute;
    top: 120px;
    left: 50%;
    margin-left: -210px;

    font-size: 90px;
    line-height: 0.73;
    text-align: center;
    letter-spacing: -6px;
    text-transform: uppercase;
    color: var(--purple);
    font-weight: 700;

    transform: rotate(-45deg);
  }

  .logo span {
    display: block;
  }

  .create-room {
    text-align: center;
  }

  .create-room__form-group {
    margin-bottom: 15px;
  }

  .number-players {
    width: 56px;
    height: 56px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    text-align: center;
    color: var(--purple);

    background: var(--light);
    border-radius: 50%;
  }

  .deal-cards {
    display: grid;
    grid-template-columns: 1fr 56px;
    grid-column-gap: 10px;
  }

  .number-players span:first-child {
    font-size: 14px;
    line-height: 1.2;
  }

  .number-players span:last-child {
    font-size: 10px;
    text-transform: uppercase;
    line-height: 1.2;
  }

  .tips {
    display: grid;
    grid-template-columns: 1fr max-content;
    grid-column-gap: 10px;
  }

  .room {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 345px auto auto;
    grid-row-gap: 20px;
    justify-items: center;
    align-items: center;
  }
</style>

{#if step}
  <main class="home">
    <div class="home__logo">
      <h1 class="logo">
        <span>Assassin</span>
        <span>Detective</span>
        <span>Victim</span>
      </h1>
    </div>

    <div class="home__forms">
      {#if step === 1}
        <form method="post" class="create-room" on:submit={handleOnRoomSubmit}>
          <div class="create-room__form-group">
            <Input
              type="text"
              value={roomName}
              name="room"
              placeholder="Room name"
              required
              autofocus />
          </div>
          <Button type="submit">Next Nickname ></Button>
        </form>
      {/if}

      {#if step === 2}
        <form
          method="post"
          class="create-room"
          on:submit={handleOnNicknameSubmit}>
          <div class="create-room__form-group">
            <Input
              type="text"
              name="nickname"
              placeholder="Your nickname"
              value={playerName}
              required
              autofocus />
          </div>
          <Button type="submit">Let's get started!</Button>
        </form>
      {/if}
    </div>
  </main>
{:else}
  <div class="room">
    <div>
      <Id {playerName} {roomName} />
    </div>

    <div>
      <Card type={cardType} />
    </div>

    <div>
      <div class="deal-cards">
        {#if matchRunning}
          <Button on:click={handleStopGame}>Stop game</Button>
        {:else}
          <Button on:click={handleNewGame}>Deal cards</Button>
        {/if}
        <div class="number-players">
          <span>
            <strong>{numberOfPlayers}</strong>
          </span>
          <span>{numberOfPlayers === 1 ? 'player' : 'players'}</span>
        </div>
      </div>
    </div>

    {#if !matchRunning}
      <div>
        <div class="tips">
          <Button clipboard={invitePlayersUrl}>Invite Friends</Button>
          <Button>Rules</Button>
        </div>
      </div>
    {/if}
  </div>
{/if}
