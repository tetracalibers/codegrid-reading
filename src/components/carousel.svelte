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

  export let count: number
  let calcMovedIdx = counter(count)
  let offset = 0

  const onClickNextButton = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    offset = calcMovedIdx("next") * -100
  }

  const onClickPrevButton = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    offset = calcMovedIdx("prev") * -100
  }

  const onClickIndicator = (e: MouseEvent | TouchEvent, idx: number) => {
    e.preventDefault()
    offset = calcMovedIdx(idx) * -100
  }
</script>

<div class="carousel">
  <div class="carousel__slide-list" style={`--slide-offset: ${offset}%`}>
    <slot />
  </div>
</div>
<button on:click={onClickPrevButton}>Prev</button>
<button on:click={onClickNextButton}>Next</button>
<ul>
  {#each [...new Array(count)] as _, i}
    <li>
      <button on:click={e => onClickIndicator(e, i)}>
        {i + 1}
      </button>
    </li>
  {/each}
</ul>

<style>
  /** 見える範囲 */
  .carousel {
  }

  /** スライドするアイテム全体 */
  .carousel__slide-list {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    /* トランジション周りの指定を追加 */
    transform: translateX(var(--slide-offset, 0));
    transition-property: transform;
    transition-duration: 0.2s;
    transition-timing-function: ease;
  }

  :global(.carousel__slide-list-item) {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 100%;
  }
</style>
