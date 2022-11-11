<script lang="ts">
  export let idx: number
</script>

<div class={"carousel-slide__item"}>
  <slot />
</div>

<style>
  .carousel-slide__item {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 100%;
  }
</style>
