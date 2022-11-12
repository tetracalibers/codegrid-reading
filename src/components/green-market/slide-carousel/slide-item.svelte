<script lang="ts">
  import { getCarouselContext } from "./index.svelte"

  export let idx: number

  const { currIdx } = getCarouselContext()

  let isCurrent: boolean
  let isPrev: boolean
  let isNext: boolean

  currIdx.subscribe(curr => {
    isCurrent = idx === curr
    isPrev = curr - idx === 1
    isNext = idx - curr === 1
  })
</script>

<div
  class={[
    "carousel-slide__item",
    isCurrent ? "--current" : "",
    isPrev ? "--prev" : "",
    isNext ? "--next" : "",
  ].join(" ")}
  style={`--idx: ${idx}`}
>
  <div style={`--current: ${$currIdx}`}><slot /></div>
</div>

<style>
  .carousel-slide__item {
    --base-transform: rotateY(calc(var(--idx) * 360deg / 5))
      translateZ(var(--slide-width)) rotateY(calc(var(--idx) * -360deg / 5));

    transform-style: preserve-3d;
    transform: var(--base-transform);
  }

  .carousel-slide__item > div {
    position: absolute;
    width: var(--slide-width);
    height: 530px;
    transform: rotateY(calc(360deg + var(--offset) * 360deg / 5));
    transform-style: preserve-3d;
    transition: transform 1s;
  }
</style>
