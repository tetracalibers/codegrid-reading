<script lang="ts">
  import { getCarouselContext } from "./index.svelte"

  /** スワイプ動作がパネルの20%を移動させたら遷移判定をする（閾値） */
  const SWIPE_THRESHOLD = 0.2
  const SWIPE_DURATION = 0
  const SLIDE_DURATION = 0.2

  let containerEl: HTMLDivElement

  const { currIdx, itemCount } = getCarouselContext()

  let slideOffset: `${number}%` = "0%"
  let swipeOffset: `${number}px` = "0px"
  let duration = 0.2
  let pointer = {
    startX: 0,
    moveX: 0,
    hold: false,
  }

  const calcMoveOffset = (nowIdx: number): `${number}%` => {
    /** width: 100%; gap: 5%; */
    return `${nowIdx * -100 + nowIdx * -5}%`
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
    const prevIdx = currIdx
    if (prevIdx !== currIdx) {
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
    style={[
      `--offset: calc(${slideOffset} + ${swipeOffset})`,
      `--duration: ${duration}s`,
    ].join(";")}
  >
    <slot />
  </div>
</div>

<style>
  /** 見える範囲 */
  .carousel-visible {
    overflow: hidden;
    padding: 2.5%;
    /** スワイプとタッチ操作の衝突を回避 */
    touch-action: none;
    /** センタリング */
    display: flex;
    justify-content: center;
  }

  /** スライドするアイテム全体 */
  .carousel-slide {
    display: flex;
    flex-wrap: nowrap;
    justify-items: center;
    width: 70vw;
    gap: 5%;
    /* トランジション周りの指定を追加 */
    transform: translateX(var(--offset, 0));
    transition-property: transform;
    transition-duration: var(--duration);
    transition-timing-function: ease;
  }
</style>
