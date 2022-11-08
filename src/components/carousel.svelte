<script lang="ts">
  import { onMount } from "svelte"

  let slideContentEl: HTMLDivElement
  let calcMovedIdx: (offset: number) => number
  let offset = 0

  const counter = (limit: number) => {
    let count = 0
    return (offset: number) => {
      count += offset
      if (!(count < limit)) {
        count = 0
      }
      if (count < 0) {
        count = limit - 1
      }
      return count
    }
  }

  const onClickNextButton = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    offset = calcMovedIdx(+1) * -100
  }

  const onClickPrevButton = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    offset = calcMovedIdx(-1) * -100
  }

  onMount(() => {
    const items = slideContentEl.querySelectorAll(".carousel__slide-list-item")
    calcMovedIdx = counter(items.length)
  })
</script>

<div class="carousel">
  <div
    class="carousel__slide-list"
    bind:this={slideContentEl}
    style={`--slide-offset: ${offset}%`}
  >
    <slot />
  </div>
</div>
<button on:click={onClickPrevButton}>Prev</button>
<button on:click={onClickNextButton}>Next</button>

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
