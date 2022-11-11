<script lang="ts">
  import { getCarouselContext } from "./index.svelte"

  export let idx: number

  const { currIdx } = getCarouselContext()
</script>

<div
  class={["carousel-slide__item", idx === $currIdx ? "--current" : ""].join(
    " ",
  )}
>
  <slot />
</div>

<style>
  .carousel-slide__item {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 100%;
  }
</style>
