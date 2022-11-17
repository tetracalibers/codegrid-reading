<script lang="ts">
  import BurgerButton from "./burger-button.svelte"
  import { onMount } from "svelte"

  let rootel: HTMLElement
  let bodyel: HTMLElement
  let transitionWrapEl: HTMLDivElement
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
      if (e.target === transitionWrapEl || e.propertyName === "visibility")
        return
      if (!opened) {
        deactiveScrollLock()
        focusOpenButtonAfterClose && buttonel.focus()
      }
    }
    transitionWrapEl.addEventListener(
      "transitionend",
      onTransitionDrawer,
      false,
    )

    /** スクロールバーの幅取得 */
    const resizeObserver = new ResizeObserver(e => {
      if (opened) return
      scrollbarW = window.innerWidth - rootel.clientWidth
      rootel.style.setProperty("--scrollbar-w", scrollbarW + "px")
    })
    resizeObserver.observe(rootel)

    /** フォーカス可能な要素の取得 */
    focusables = navel.querySelectorAll("a[href], button:not(:disabled)")
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
      transitionWrapEl.removeEventListener(
        "transitionend",
        onTransitionDrawer,
        false,
      )
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
<div bind:this={transitionWrapEl}>
  <div class="drawer fix-scrollbar-gutter" id="drawer" aria-expanded={opened}>
    <nav bind:this={navel} class="drawer-nav nav remove-scrollbar-margin">
      <slot />
    </nav>
  </div>
  <div class="drawer-backdrop" />
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
    left: 10px;
  }

  .drawer {
    position: fixed;
    top: 0;
    z-index: 9998;
    left: 0;
    right: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .drawer-backdrop {
    position: absolute;
    z-index: 9997;
    /** 円の形 */
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #457703;
  }

  .nav {
    overflow: auto;
  }

  /** 開閉アニメーション */

  .drawer[aria-expanded] {
    transition-property: visibility;
    transition-duration: 0.6s;
  }
  .drawer[aria-expanded] ~ .drawer-backdrop {
    transition-property: transform;
    transition-duration: 0.6s;
  }

  /** 開いているとき */
  .drawer[aria-expanded="true"] {
    visibility: visible;
  }
  .drawer[aria-expanded="true"] ~ .drawer-backdrop {
    transform: scale(50);
  }

  /** 閉じているとき */
  .drawer[aria-expanded="false"] {
    visibility: hidden;
  }
  .drawer[aria-expanded="false"] ~ .drawer-backdrop {
    /* 円の初期状態 */
    transform: scale(0);
    left: 0;
    right: 0;
  }
</style>
