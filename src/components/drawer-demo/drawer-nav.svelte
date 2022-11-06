<script lang="ts">
  import BurgerButton from "@/components/drawer-demo/burger-button.svelte"
  import { onMount } from "svelte"

  let rootel: HTMLElement
  let bodyel: HTMLElement
  let drawerel: HTMLDivElement
  let scrollbarW: number

  const scrollLockModifier = "scroll-lock"

  const activeScrollLock = () => {
    rootel.classList.add(scrollLockModifier)
    bodyel.classList.add(scrollLockModifier)
  }
  const deactiveScrollLock = () => {
    rootel.classList.remove(scrollLockModifier)
    bodyel.classList.remove(scrollLockModifier)
  }

  let opened = false
  const toggle = () => {
    if (!opened) activeScrollLock()
    opened = !opened
  }

  const onTransitionDrawer = (e: TransitionEvent) => {
    if (e.target === drawerel || e.propertyName === "visibility") return
    if (!opened) deactiveScrollLock()
  }

  onMount(() => {
    rootel = document.documentElement
    bodyel = document.body
    drawerel.addEventListener("transitionend", onTransitionDrawer, false)

    const resizeObserver = new ResizeObserver(e => {
      if (opened) return
      scrollbarW = window.innerWidth - rootel.clientWidth
      rootel.style.setProperty("--scrollbar-w", scrollbarW + "px")
    })
    resizeObserver.observe(rootel)

    return () => {
      drawerel.removeEventListener("transitionend", onTransitionDrawer, false)
      resizeObserver.unobserve(rootel)
    }
  })
</script>

<div class="trigger-button fix-scrollbar-gutter">
  <BurgerButton {opened} on:click={toggle} navid="drawer" />
</div>
<div
  class="drawer fix-scrollbar-gutter"
  id="drawer"
  aria-expanded={opened}
  bind:this={drawerel}
>
  <div class="drawer-backdrop" />
  <nav class="drawer-nav nav remove-scrollbar-margin">
    <slot />
  </nav>
</div>

<style>
  :global(html) {
    overflow-y: scroll;
  }

  :global(body) {
    margin: 0;
  }

  :global(.scroll-lock) {
    overflow: hidden;
  }

  :global(html.scroll-lock .fix-scrollbar-gutter) {
    margin-right: var(--scrollbar-w);
  }

  :global(html.scroll-lock .remove-scrollbar-margin) {
    margin-right: calc(-1 * var(--scrollbar-w));
  }

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
    right: 0;
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
