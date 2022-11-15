<script lang="ts">
  import products from "@/contents/green-market/new-item.yml"
  import ProductFlipCard from "./product-flip-card.svelte"
</script>

{#each products as product}
  <ProductFlipCard {product} />
{/each}
