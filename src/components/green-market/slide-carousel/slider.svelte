<script lang="ts">
  import { getCarouselContext } from "./index.svelte"

  /** スワイプ動作がパネルの20%を移動させたら遷移判定をする（閾値） */
  const SWIPE_THRESHOLD = 0.2
  const SWIPE_DURATION = 0
  const SLIDE_DURATION = 0.2

  let containerEl: HTMLDivElement

  const { currIdx, itemCount } = getCarouselContext()

  let slideOffset = 0
  let swipeOffset: `${number}px` = "0px"
  let duration = 0.2
  let pointer = {
    startX: 0,
    moveX: 0,
    hold: false,
  }

  let counter = 0

  const calcMoveOffset = (nowIdx: number): number => {
    return ++counter
  }

  /** currIdxが変化したらスライドアニメーション */
  currIdx.subscribe(idx => (slideOffset = calcMoveOffset(idx)))

  const getIdxSwipeEnd = () => {
    /** 閾値を超えているかどうかの判定に使う */
    const absMoveX = Math.abs(pointer.moveX)
    const addIdx = pointer.moveX > 0 ? -1 : 1

    const isOverThreshold = absMoveX > containerEl.clientWidth * SWIPE_THRESHOLD
    const isNotExistNext = $currIdx === 0 && addIdx === -1
    const isNotExistPrev = $currIdx === itemCount - 1 && addIdx === 1

    /** 遷移しない */
    if (!isOverThreshold || isNotExistPrev || isNotExistNext) {
      return $currIdx
    }
    /** 遷移する */
    return $currIdx + addIdx
  }

  /** pointerdown時 */
  const onSwipeStart = (e: PointerEvent) => {
    if (!e.isPrimary) return
    e.preventDefault()
    pointer.startX = e.clientX
    pointer.hold = true
    /** 追従動作中のdurationは0に */
    duration = SWIPE_DURATION
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
    duration = SLIDE_DURATION
    swipeOffset = "0px"
    /** 必要に応じてスライドを実行 */
    const nextIdx = getIdxSwipeEnd()
    if (nextIdx !== $currIdx) {
      currIdx.set(getIdxSwipeEnd())
    }
    /** pointer情報をリセット */
    pointer.startX = 0
    pointer.moveX = 0
    pointer.hold = false
  }
</script>

<div
  class="carousel-visible"
  bind:this={containerEl}
  on:pointerdown={onSwipeStart}
  on:pointermove={onSwiping}
  on:pointerup={onSwipeEnd}
  on:pointercancel={onSwipeEnd}
>
  <div
    class="carousel-slide"
    style={[`--offset: ${slideOffset}`, `--duration: ${duration}s`].join(";")}
  >
    <slot />
  </div>
</div>

<style>
  /** 見える範囲 */
  .carousel-visible {
    --slide-width: 70vw;
    /** スワイプとタッチ操作の衝突を回避 */
    touch-action: none;
    perspective: calc(var(--slide-width) * 7);
    position: relative;
    width: var(--slide-width);
    height: 530px;
    margin: 0 auto;
  }

  /** スライドするアイテム全体 */
  .carousel-slide {
    position: absolute;
    width: var(--slide-width);
    height: 600px;
    transform-style: preserve-3d;
    transform: rotateY(calc(-1 * (360deg + var(--offset) * 360deg / 5)));
    /* animation: rotar 30s infinite linear; */
    transition: transform 1s;
  }

  @keyframes rotar {
    from {
      transform: rotateY(0deg);
    }
    to {
      transform: rotateY(360deg);
    }
  }
</style>
