<script lang="ts">
  import ProductLink from "./product-link.svelte"
  import SlideCarousel from "@/components/green-market/slide-carousel/index.svelte"
  import SlideItem from "./slide-carousel/slide-item.svelte"

  interface Product {
    name: string
    price: number
    page_url: string
    img_name: string
    img_alt: string
  }

  export let products: Product[]
</script>

<SlideCarousel itemCount={products.length}>
  {#each products as product, i}
    <SlideItem idx={i}><ProductLink {product} /></SlideItem>
  {/each}
</SlideCarousel>
