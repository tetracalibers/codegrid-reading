<script lang="ts">
  const counter = (limit: number) => {
    let count = 0
    return (move: "prev" | "next" | number) => {
      if (move === "prev") count -= 1
      if (move === "next") count += 1
      if (typeof move === "number") count = move
      if (!(count < limit)) {
        count = 0
      }
      if (count < 0) {
        count = limit - 1
      }
      return count
    }
  }

  const calcMoveOffset = (nowIdx: number) => {
    // width: 100%; gap: 5%;
    return nowIdx * -100 + nowIdx * -5
  }

  export let count: number
  let calcMovedIdx = counter(count)
  let currIdx = 0
  let offset = 0

  const move = () => {
    offset = calcMoveOffset(currIdx)
  }

  const onClickNextButton = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    currIdx = calcMovedIdx("next")
    move()
  }

  const onClickPrevButton = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    currIdx = calcMovedIdx("prev")
    move()
  }

  const onClickIndicator = (e: MouseEvent | TouchEvent, idx: number) => {
    e.preventDefault()
    currIdx = calcMovedIdx(idx)
    move()
  }
</script>

<div class="carousel">
  <div class="carousel-visible">
    <div class="carousel-slide" style={`--slide-offset: ${offset}%`}>
      <slot />
    </div>
  </div>
  <div class="carousel-buttons">
    <button on:click={onClickPrevButton}>Prev</button>
    <button on:click={onClickNextButton}>Next</button>
  </div>
  <ul class="carousel-indicator">
    {#each [...new Array(count)] as _, i}
      <li class="carousel-indicator__item">
        <button
          class={[
            `carousel-indicator__button`,
            i === currIdx ? "--active" : "",
          ].join(" ")}
          on:click={e => onClickIndicator(e, i)}
        >
          <span class="visually-hidden">{i + 1}</span>
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
  /** 見える範囲 */
  .carousel {
  }

  .carousel-visible {
    overflow: hidden;
    padding: 2.5%;
  }

  /** スライドするアイテム全体 */
  .carousel-slide {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    gap: 5%;
    /* トランジション周りの指定を追加 */
    transform: translateX(var(--slide-offset, 0));
    transition-property: transform;
    transition-duration: 0.2s;
    transition-timing-function: ease;
  }

  :global(.carousel-slide__item) {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 100%;
  }

  .carousel-indicator {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .carousel-indicator__item {
    /** heightを子要素にfitさせる */
    display: flex;
  }

  .carousel-indicator__button {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    appearance: none;
    border: none;
    padding: 0;
    background-color: #eef1ff;
  }

  .carousel-indicator__button:hover {
    cursor: pointer;
  }

  .carousel-indicator__button:hover,
  .carousel-indicator__button:focus,
  .carousel-indicator__button:active,
  .carousel-indicator__button.--active {
    background-color: #b1afff;
  }

  .visually-hidden {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }
</style>
