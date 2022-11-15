<script lang="ts">
  import ProductLink from "./product-link.svelte"
  import SlideCarousel from "@/components/green-market/slide-carousel/index.svelte"
  import { ComponentType } from "svelte"
  import { Product } from "./types"

  export let products: Product[]

  const datalist = products.map(product => ({ product }))
  const component = ProductLink as ComponentType
</script>

<SlideCarousel {datalist} {component} />
