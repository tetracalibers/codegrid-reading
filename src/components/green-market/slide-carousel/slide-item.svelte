<script lang="ts">
  import { getCarouselContext } from "./index.svelte"

  export let idx: number

  const { currIdx, itemCount, dir } = getCarouselContext()

  let isCurrent: boolean
  let isPrev: boolean
  let isNext: boolean

  currIdx.subscribe(curr => {
    isCurrent = idx === curr
    isPrev = (curr === 0 && idx === itemCount - 1) || curr - idx === 1
    isNext = (curr === itemCount - 1 && idx === 0) || idx - curr === 1
  })
</script>

<div
  class={[
    "carousel-slide__item",
    isCurrent ? "--current" : "",
    isPrev ? "--prev" : "",
    isNext ? "--next" : "",
  ].join(" ")}
  style={[`--idx: ${idx}`, `--dir: ${$dir}`].join(";")}
>
  <slot />
</div>

<style>
  .carousel-slide__item {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 100%;
  }

  .carousel-slide__item.--current {
    transform: scale(1) translateX(0);
    animation: current 0.4s;
  }

  .carousel-slide__item.--prev {
    transform: scale(0.8) translateX(0);
    animation: prev 0.4s;
  }

  .carousel-slide__item.--next {
    transform: translateX(0) scale(0.8);
    animation: next 0.4s;
  }

  @keyframes current {
    from {
      transform: scale(0.8) translateX(calc(var(--dir, 1) * var(--slide-width)));
    }
    to {
      transform: scale(1) translateX(0);
    }
  }

  @keyframes prev {
    from {
      transform: scale(1) translateX(calc(var(--dir, 1) * var(--slide-width)));
    }
    to {
      transform: scale(0.8) translateX(0px);
    }
  }

  @keyframes next {
    from {
      transform: translateX(calc(var(--dir, 1) * var(--slide-width))) scale(1);
    }
    to {
      transform: translateX(0px) scale(0.8);
    }
  }
</style>
