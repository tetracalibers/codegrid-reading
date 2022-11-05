<script lang="ts">
  import BurgerButton from "@/components/drawer-demo/burger-button.svelte"

  let opened = false
  const toggle = () => (opened = !opened)
</script>

<div class="trigger-button">
  <BurgerButton {opened} on:click={toggle} navid="drawer" />
</div>
<div class="drawer" id="drawer" aria-expanded={opened}>
  <div class="drawer-backdrop" />
  <nav class="drawer-nav nav">
    <slot />
  </nav>
</div>

<style>
  .trigger-button {
    position: fixed;
    z-index: 9999; /*ボタンを最前面に*/
    top: 10px;
    right: 10px;
  }

  .drawer {
    position: fixed;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .drawer-backdrop {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .drawer-nav {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 280px;
    background-color: #fff;
  }

  .nav {
    overflow: auto;
  }

  /** 開閉アニメーション */

  .drawer[aria-expanded] {
    transition-property: visibility;
    transition-duration: 0.25s;
  }
  .drawer[aria-expanded] .drawer-backdrop {
    transition-property: opacity;
    transition-duration: 0.25s;
    transition-timing-function: linear;
  }
  .drawer[aria-expanded] .drawer-nav {
    transition-property: transform;
    transition-duration: 0.25s;
    transition-timing-function: ease;
  }

  /** 開いているとき */
  .drawer[aria-expanded="true"] {
    visibility: visible;
  }
  .drawer[aria-expanded="true"] .drawer-backdrop {
    opacity: 1;
  }
  .drawer[aria-expanded="true"] .drawer-nav {
    transform: translateX(0);
  }

  /** 閉じているとき */
  .drawer[aria-expanded="false"] {
    visibility: hidden;
  }
  .drawer[aria-expanded="false"] .drawer-backdrop {
    opacity: 0;
  }
  .drawer[aria-expanded="false"] .drawer-nav {
    transform: translateX(100%);
  }
</style>
