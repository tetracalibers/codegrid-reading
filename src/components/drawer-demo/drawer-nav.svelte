<script lang="ts">
  import BurgerButton from "@/components/drawer-demo/burger-button.svelte"
  import { onMount } from "svelte"

  let rootel: HTMLElement
  let bodyel: HTMLElement
  let drawerel: HTMLDivElement
  let navel: HTMLElement
  let buttonel: HTMLButtonElement
  let focusables: NodeListOf<HTMLElement>
  let firstFocusable: HTMLElement
  let lastFocusable: HTMLElement
  let scrollbarW: number

  // ドロワーが開いているか
  let opened = false
  // 閉じたあとに開くボタンにフォーカスを戻すか
  let focusOpenButtonAfterClose = true

  // 背景スクロールの禁止切り替え
  const scrollLockModifier = "scroll-lock"
  const activeScrollLock = () => {
    rootel.classList.add(scrollLockModifier)
    bodyel.classList.add(scrollLockModifier)
  }
  const deactiveScrollLock = () => {
    rootel.classList.remove(scrollLockModifier)
    bodyel.classList.remove(scrollLockModifier)
  }

  // 開閉
  const openDrawer = () => {
    // ドロワーを開くときにフォーカスを戻すようリセット
    focusOpenButtonAfterClose = true
    opened = true
  }
  const closeDrawer = () => {
    opened = false
  }

  // 開閉ボタンクリック
  const onClickOpenButton = () => {
    activeScrollLock()
    openDrawer()
    firstFocusable.focus()
  }
  const onClickCloseButton = () => {
    closeDrawer()
  }

  // Shift+Tabキー押下時、それが最初のTabキー操作可能な要素の場合は、最後の要素にフォーカスが移動する
  const onTabKeydownFirstFocusable = (e: KeyboardEvent) => {
    if (e.key !== "Tab" || !e.shiftKey) return
    e.preventDefault()
    lastFocusable.focus()
  }

  // Tabキー押下時、それが最後のTabキー操作可能な要素の場合は、最初の要素にフォーカスが移動する
  const onTabKeydownLastFocusable = (e: KeyboardEvent) => {
    if (e.key !== "Tab" || e.shiftKey) return
    e.preventDefault()
    firstFocusable.focus()
  }

  // Escキーでドロワーを閉じる
  const onEscKeydown = (e: KeyboardEvent) => {
    if (!opened || e.key !== "Escape") return
    e.preventDefault()
    closeDrawer()
  }

  // リンククリックでドロワーを閉じる
  const onClickAnchorLink = (e: MouseEvent | TouchEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName !== "A") return
    // 開くボタンにフォーカスを戻さずにclose
    focusOpenButtonAfterClose = false
    closeDrawer()
  }

  onMount(() => {
    rootel = document.documentElement
    bodyel = document.body

    /** 背景スクロールの禁止 */
    const onTransitionDrawer = (e: TransitionEvent) => {
      if (e.target === drawerel || e.propertyName === "visibility") return
      if (!opened) {
        deactiveScrollLock()
        focusOpenButtonAfterClose && buttonel.focus()
      }
    }
    drawerel.addEventListener("transitionend", onTransitionDrawer, false)

    /** スクロールバーの幅取得 */
    const resizeObserver = new ResizeObserver(e => {
      if (opened) return
      scrollbarW = window.innerWidth - rootel.clientWidth
      rootel.style.setProperty("--scrollbar-w", scrollbarW + "px")
    })
    resizeObserver.observe(rootel)

    /** フォーカス可能な要素の取得 */
    focusables = drawerel.querySelectorAll("a[href], button:not(:disabled)")
    firstFocusable = focusables[0]
    lastFocusable = focusables[focusables.length - 1]

    /** フォーカスの閉じ込め */
    firstFocusable.addEventListener(
      "keydown",
      onTabKeydownFirstFocusable,
      false,
    )
    lastFocusable.addEventListener("keydown", onTabKeydownLastFocusable, false)

    /** Escキーでドロワーを閉じる */
    window.addEventListener("keydown", onEscKeydown, false)

    /** リンククリックでドロワーを閉じる */
    navel.addEventListener("click", onClickAnchorLink, false)

    return () => {
      drawerel.removeEventListener("transitionend", onTransitionDrawer, false)
      firstFocusable.removeEventListener(
        "keydown",
        onTabKeydownFirstFocusable,
        false,
      )
      lastFocusable.removeEventListener(
        "keydown",
        onTabKeydownLastFocusable,
        false,
      )
      window.removeEventListener("keydown", onEscKeydown, false)
      navel.removeEventListener("click", onClickAnchorLink, false)
      resizeObserver.unobserve(rootel)
    }
  })
</script>

<div class="trigger-button fix-scrollbar-gutter">
  <BurgerButton
    {opened}
    on:click={opened ? onClickCloseButton : onClickOpenButton}
    bind:el={buttonel}
    navid="drawer"
  />
</div>
<div
  class="drawer fix-scrollbar-gutter"
  id="drawer"
  aria-expanded={opened}
  bind:this={drawerel}
>
  <div class="drawer-backdrop" />
  <nav bind:this={navel} class="drawer-nav nav remove-scrollbar-margin">
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
