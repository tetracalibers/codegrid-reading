<script lang="ts">
  import { onMount } from "svelte"

  import { getCarouselContext } from "./index.svelte"

  /** スワイプ動作がパネルの20%を移動させたら遷移判定をする（閾値） */
  const SWIPE_THRESHOLD = 0.2

  let containerEl: HTMLDivElement
  let rootel: HTMLElement
  let imgWidth: number

  const { currIdx, itemCount } = getCarouselContext()

  let swipeOffset: `${number}px` = "0px"
  let pointer = {
    startX: 0,
    moveX: 0,
    hold: false,
  }

  const slide = () => {
    if (containerEl) {
      containerEl.scrollTo({
        left: $currIdx * imgWidth,
      })
    }
  }

  /** currIdxが変化したらスライドアニメーション */
  currIdx.subscribe(idx => {
    slide()
  })

  const getIdxSwipeEnd = () => {
    /** 閾値を超えているかどうかの判定に使う */
    const absMoveX = Math.abs(pointer.moveX)
    const addIdx = pointer.moveX > 0 ? -1 : 1

    const isOverThreshold = absMoveX > imgWidth * SWIPE_THRESHOLD

    /** 遷移しない */
    if (!isOverThreshold) {
      return $currIdx
    }

    /** 遷移する */
    let swipedIdx = $currIdx + addIdx
    if (swipedIdx > itemCount - 1) {
      swipedIdx = 0
    }
    if (swipedIdx < 0) {
      swipedIdx = itemCount - 1
    }
    return swipedIdx
  }

  /** pointerdown時 */
  const onSwipeStart = (e: PointerEvent) => {
    if (!e.isPrimary) return
    e.preventDefault()
    pointer.startX = e.clientX
    pointer.hold = true
  }

  /** pointermove時 */
  const onSwiping = (e: PointerEvent) => {
    if (!e.isPrimary || !pointer.hold) return
    e.preventDefault()
    const moveX = e.clientX - pointer.startX
    pointer.moveX = moveX
    swipeOffset = `${moveX}px`
  }

  /** pointerup時 */
  const onSwipeEnd = (e: PointerEvent) => {
    if (!e.isPrimary || !pointer.hold) return
    e.preventDefault()
    /** スワイプ追従終了 */
    swipeOffset = "0px"
    /** 必要に応じてスライドを実行 */
    const nextIdx = getIdxSwipeEnd()
    if (nextIdx !== $currIdx) {
      currIdx.set(nextIdx)
    }
    /** pointer情報をリセット */
    pointer.startX = 0
    pointer.moveX = 0
    pointer.hold = false
  }

  onMount(() => {
    rootel = document.documentElement

    imgWidth = window.innerWidth * 0.7
    const resizeObserver = new ResizeObserver(e => {
      imgWidth = window.innerWidth * 0.7
      slide()
    })
    resizeObserver.observe(rootel)

    return () => {
      resizeObserver.unobserve(rootel)
    }
  })
</script>

<div
  class="carousel-visible"
  bind:this={containerEl}
  on:pointerdown={onSwipeStart}
  on:pointermove={onSwiping}
  on:pointerup={onSwipeEnd}
  on:pointercancel={onSwipeEnd}
  style={[`--swipe-offset: ${swipeOffset}`, `--count: ${itemCount}`].join(";")}
>
  <div class="carousel-slide">
    <slot />
    <slot />
    <slot />
  </div>
</div>

<style>
  /** 見える範囲 */
  .carousel-visible {
    --slide-width: 70vw;
    overflow: hidden;
    /** 中央配置 */
    padding-left: calc(var(--slide-width) / var(--count));
    /** 2つ目のslotが表示されるように */
    margin-left: calc(-1 * var(--slide-width) * var(--count));
    /** スワイプとタッチ操作の衝突を回避 */
    touch-action: none;
    /** スワイプ追従 */
    transform: translateX(var(--swipe-offset));
  }

  /** スライドするアイテム全体 */
  .carousel-slide {
    display: flex;
    flex-wrap: nowrap;
    width: var(--slide-width);
  }
</style>
