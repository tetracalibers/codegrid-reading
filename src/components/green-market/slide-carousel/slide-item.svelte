<script lang="ts">
  import { getCarouselContext } from "./index.svelte"

  export let idx: number

  const { currIdx, itemCount } = getCarouselContext()

  let isCurrent: boolean
  let isPrev: boolean
  let isNext: boolean
  let isFirstAndNext: boolean

  currIdx.subscribe(curr => {
    isCurrent = idx === curr
    isPrev = curr - idx === 1
    isNext = idx - curr === 1
    isFirstAndNext = curr === itemCount - 1 && idx === 0
  })
</script>

<div
  class={[
    "carousel-slide__item",
    isCurrent ? "--current" : "",
    isPrev ? "--prev" : "",
    isNext ? "--next" : "",
    isFirstAndNext ? "--first-and-next" : "",
  ].join(" ")}
>
  <slot />
</div>

<style>
  .carousel-slide__item {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 100%;
    transform-style: preserve-3d;
    transform: rotateY(calc(var(--offset) * 60deg));
  }

  .carousel-slide__item.--prev {
    transform: translateX(2rem) scale(0.7);
    z-index: -1;
  }

  .carousel-slide__item.--next {
    transform: translateX(-2rem) scale(0.7);
    z-index: -1;
  }

  /* .carousel-slide__item.--first-and-next {
    transform: translateX(calc(-1 * var(--offset) + 100% + 2rem)) scale(0.7);
    z-index: -1;
  } */
</style>
