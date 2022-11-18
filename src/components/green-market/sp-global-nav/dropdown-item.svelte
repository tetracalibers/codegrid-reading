<script lang="ts">
  import { ImageConf } from "../types"

  export let img: ImageConf
  export let href: string
  export let text: string
</script>

<li>
  <a {href} class="sp-gnav-link">
    <div class="sp-gnav-link__img-wrapper">
      <img src={`/images/coco-factory/grean-market/${img.src}`} alt={img.alt} />
    </div>
    <div class="sp-gnav-link__txt">{text}</div>
  </a>
</li>

<style>
  .sp-gnav-link {
    display: flex;
    align-items: center;
    gap: 4%;
    background-color: #6ea924;
  }
  .sp-gnav-link__img-wrapper {
    width: 30%;
  }
  .sp-gnav-link__img-wrapper img {
    width: 100%;
    height: auto;
  }
  .sp-gnav-link__txt {
    text-transform: uppercase;
    color: #fff;
  }
</style>
