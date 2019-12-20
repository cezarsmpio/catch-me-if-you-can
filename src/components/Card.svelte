<script context="module">
  export const CARDS = {
    0: "ASSASSIN",
    1: "DETECTIVE",
    2: "VICTIM"
  };
</script>

<script>
  import { onMount } from "svelte";

  export let type = "";

  let gifUrl;
  let isLoadingGif = true;

  $: cardTypeIcon = type
    ? Object.values(CARDS)
        .find(card => card === type)
        .toLowerCase()
    : "";
  $: cardTypeIconUrl = `/images/icon-${cardTypeIcon}.svg`;

  onMount(async () => {
    await fetchRandomGift();
  });

  async function fetchRandomGift() {
    isLoadingGif = true;

    const giphyApiKey = "dlIB7VHujBYeC2o9KRdvN74bC1rGcmDb";
    const tag = "friends, funny, kitty, puppy";
    const res = await fetch(
      `https://api.giphy.com/v1/gifs/random?api_key=${giphyApiKey}&tag=${tag}&rating=G`
    );
    const json = await res.json();

    isLoadingGif = false;
    gifUrl = json.data.fixed_width_small_url;
  }

  async function handleNewGifClick() {
    await fetchRandomGift();
  }
</script>

<style>
  .card-scene {
    width: 235px;
    height: 345px;

    perspective: 600px;
    -webkit-perspective: 600px;
    -moz-perspective: 600px;
  }

  .card {
    position: relative;

    width: 235px;
    height: 345px;

    transform-style: preserve-3d;
    transform-origin: center;
    box-shadow: 0px 15px 35px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    transform: rotateY(180deg);
  }

  .card.card--flipped {
    animation: cardFlip 0.275s forwards linear;
  }

  .card.card--unflipped {
    animation: cardUnFlip 0.275s forwards linear;
  }

  @keyframes cardFlip {
    0% {
      transform: rotateZ(0deg) rotateY(180deg);
    }
    50% {
      transform: rotateZ(-10deg) rotateY(90deg);
    }
    100% {
      transform: rotateZ(0deg) rotateY(0deg);
    }
  }

  @keyframes cardUnFlip {
    0% {
      transform: rotateZ(0deg) rotateY(0deg);
    }
    50% {
      transform: rotateZ(-10deg) rotateY(90deg);
    }
    100% {
      transform: rotateZ(0deg) rotateY(180deg);
    }
  }

  .card__back,
  .card__front {
    position: absolute;
    top: 0;
    left: 0;
    backface-visibility: hidden;

    width: 100%;
    height: 100%;
    border-radius: 10px;
  }

  .card__front {
    z-index: 2;

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 5fr 1fr 3fr;
    grid-row-gap: 10px;
    justify-items: center;
    align-items: center;
    padding: 25px;

    background-color: var(--light);
    transform: rotateY(0deg);
  }

  .card__back {
    z-index: 4;

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 185px 1fr;
    align-items: center;
    justify-content: center;
    padding: 25px;

    background-color: var(--purple);
    transform: rotateY(180deg);
  }

  .card__gif-image {
    width: 100%;
    height: auto;
    max-height: 185px;
    border-radius: 8px;
  }

  .card__new-gif {
    display: inline-block;
    justify-self: center;

    border: 0;
    background: 0;
    cursor: pointer;
    transition: all 0.1s;
  }

  .card__new-gif:active {
    transform: scale(0.8);
  }

  .card__new-gif:disabled {
    opacity: 0.3;
  }

  .card__type-title {
    text-align: center;
    font-size: 20px;
    text-transform: uppercase;
  }

  .card__type-description {
    text-align: center;
    font-size: 14px;
  }
</style>

<div class="card-scene">
  <div class="card" class:card--flipped={type} class:card--unflipped={!type}>
    <div class="card__front">
      {#if type}
        <img src={cardTypeIconUrl} alt="" class="card__type-img" />
        <h3 class="card__type-title">Kill them all</h3>
        <p class="card__type-description">
          Blink at your enemy and they should be gone. Forever.
        </p>
      {/if}
    </div>

    <div class="card__back">
      <div class="card__gif-container">
        {#if !isLoadingGif}
          <img src={gifUrl} class="card__gif-image" alt="" />
        {/if}
      </div>

      <button
        class="card__new-gif"
        on:click={handleNewGifClick}
        disabled={isLoadingGif}>
        <img
          src="/images/icon-reload.svg"
          width="44"
          height="33"
          alt="Reload a new gif" />
      </button>
    </div>
  </div>
</div>
