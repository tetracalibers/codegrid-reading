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
  <div class="carousel-content">
    <div class="carousel-visible">
      <div class="carousel-slide" style={`--slide-offset: ${offset}%`}>
        <slot />
      </div>
    </div>
    <div class="carousel-prev-next">
      <button
        class="carousel-prev-next__button --prev"
        on:click={onClickPrevButton}
      >
        <span class="visually-hidden">Prev</span>
      </button>
      <button
        class="carousel-prev-next__button --next"
        on:click={onClickNextButton}
      >
        <span class="visually-hidden">Next</span>
      </button>
    </div>
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
  /** Base rule */
  button {
    appearance: none;
    border: none;
    padding: 0;
  }

  button:hover {
    cursor: pointer;
  }

  /** Utility */
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

  .carousel {
  }

  /** 見える範囲 */
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

  .carousel-content {
    position: relative;
  }

  .carousel-prev-next__button {
    --arrow-color: #ff8aae;
    --arrow-color--hover: #ecc5fb;
    width: 1.25rem;
    height: 1.25rem;
    position: absolute;
    top: 50%;
    border-top: 3px solid var(--arrow-color);
    border-right: 3px solid var(--arrow-color);
    transform: translateY(-50%) rotate(var(--rotate));
    background-color: transparent;
  }

  .carousel-prev-next__button.--prev {
    --rotate: -135deg;
    left: 0;
  }

  .carousel-prev-next__button.--next {
    --rotate: 45deg;
    right: 0;
  }

  .carousel-prev-next__button:hover,
  .carousel-prev-next__button:focus,
  .carousel-prev-next__button:active {
    border-top-color: var(--arrow-color--hover);
    border-right-color: var(--arrow-color--hover);
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
    background-color: #eef1ff;
  }

  .carousel-indicator__button:hover,
  .carousel-indicator__button:focus,
  .carousel-indicator__button:active,
  .carousel-indicator__button.--active {
    background-color: #b1afff;
  }
</style>
