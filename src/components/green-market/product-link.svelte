<script lang="ts">
  interface Product {
    name: string
    price: number
    page_url: string
    img_name: string
    img_alt: string
  }

  export let product: Product
</script>

<a href={product.page_url} class={[$$props.class, "gm-product-link"].join(" ")}>
  <figure class="gm-product-link__inner">
    <img
      class="gm-product-link__image"
      src={`/images/coco-factory/grean-market/${product.img_name}`}
      alt={product.img_alt}
    />
    <figcaption class="gm-product-link__caption">
      <span class="gm-product-link__name">{product.name}</span>
      <span class="gm-product-link__price">
        ¥{product.price.toLocaleString()}
      </span>
    </figcaption>
  </figure>
</a>

<style>
  .gm-product-link {
    width: 70vw;
  }

  .gm-product-link__inner {
    position: relative;
    width: 70vw;
  }

  .gm-product-link__image {
    border-radius: 10px;
    height: auto;
    width: 70vw;
    min-width: 70vw;
  }

  .gm-product-link__caption {
    display: inline-flex;
    background-color: #fff;
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 2px 10px;
    border-radius: 10px;
    gap: 0.5rem;
  }
</style>
