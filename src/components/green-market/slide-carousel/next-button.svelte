<script lang="ts">
  import { getCarouselContext } from "./index.svelte"

  const { currIdx, itemCount } = getCarouselContext()

  const onClickNextButton = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    currIdx.update(curr => {
      const next = curr + 1
      return next > itemCount - 1 ? 0 : next
    })
  }
</script>

<button class="carousel-prev-next__button --next" on:click={onClickNextButton}>
  <span class="visually-hidden">Next</span>
</button>
