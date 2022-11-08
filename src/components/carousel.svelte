<script lang="ts">
  import { onMount } from "svelte"

  let slideContentEl: HTMLDivElement
  let current: () => number
  let offset = 0

  const counter = (limit: number) => {
    let count = 0
    return () => {
      count++
      if (!(count < limit)) {
        count = 0
      }
      return count
    }
  }

  const onClickNextButton = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    offset = current() * -100
  }

  onMount(() => {
    const items = slideContentEl.querySelectorAll(".carousel__slide-list-item")
    current = counter(items.length)
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
