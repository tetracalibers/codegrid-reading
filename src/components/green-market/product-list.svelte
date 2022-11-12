<script lang="ts">
  import ProductLink from "./product-link.svelte"
  import SlideCarousel from "@/components/green-market/slide-carousel/index.svelte"
  import { ComponentType } from "svelte"

  interface Product {
    name: string
    price: number
    page_url: string
    img_name: string
    img_alt: string
  }

  export let products: Product[]

  const datalist = products.map(product => ({ product }))
  const component = ProductLink as ComponentType
</script>

<SlideCarousel {datalist} {component} />
