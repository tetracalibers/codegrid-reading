<script lang="ts">
  import { getCarouselContext } from "./index.svelte"

  const { currIdx, itemCount } = getCarouselContext()

  const onClickPrevButton = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    currIdx.update(curr => {
      const prev = curr - 1
      return prev < 0 ? itemCount - 1 : prev
    })
  }
</script>

<button class="carousel-prev-next__button --prev" on:click={onClickPrevButton}>
  <span class="visually-hidden">Prev</span>
</button>
