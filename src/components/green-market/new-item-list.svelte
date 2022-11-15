<script lang="ts">
  import EnlargeableGallery from "@/components/green-market/enlargeable-gallery/index.svelte"
  import ProductLink from "@/components/green-market/product-link.svelte"
  import ProductFlipCard from "./product-flip-card.svelte"
  import { Product } from "./types"

  export let products: Product[]

  const propslist = products.map(product => ({ product }))
</script>

<EnlargeableGallery
  enlargedComponent={ProductLink}
  thumbComponent={ProductFlipCard}
  {propslist}
/>
