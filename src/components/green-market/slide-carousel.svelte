<script lang="ts">
  /** スワイプ動作がパネルの20%を移動させたら遷移判定をする（閾値） */
  const SWIPE_THRESHOLD = 0.2
  const SWIPE_DURATION = 0
  const SLIDE_DURATION = 0.2

  export let count: number

  let containerEl: HTMLDivElement
  let currIdx = 0
  let slideOffset = "0%"
  let swipeOffset = "0px"
  let duration = 0.2
  let pointer = {
    startX: 0,
    moveX: 0,
    hold: false,
  }

  const calcMovedIdx = (move: "prev" | "next" | number) => {
    let idx = currIdx
    if (move === "prev") idx -= 1
    if (move === "next") idx += 1
    if (typeof move === "number") idx = move
    if (!(idx < count)) {
      idx = 0
    }
    if (currIdx < 0) {
      idx = count - 1
    }
    return idx
  }

  const calcMoveOffset = (nowIdx: number) => {
    /** width: 100%; gap: 5%; */
    return nowIdx * -100 + nowIdx * -5 + "%"
  }

  const slide = () => {
    slideOffset = calcMoveOffset(currIdx)
  }

  const onClickNextButton = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    currIdx = calcMovedIdx("next")
    slide()
  }

  const onClickPrevButton = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    currIdx = calcMovedIdx("prev")
    slide()
  }

  const onClickIndicator = (e: MouseEvent | TouchEvent, idx: number) => {
    e.preventDefault()
    currIdx = calcMovedIdx(idx)
    slide()
  }

  const getIdxSwipeEnd = () => {
    /** 閾値を超えているかどうかの判定に使う */
    const absMoveX = Math.abs(pointer.moveX)
    const addIdx = pointer.moveX > 0 ? -1 : 1

    const isOverThreshold = absMoveX > containerEl.clientWidth * SWIPE_THRESHOLD
    const isNotExistNext = currIdx === 0 && addIdx === -1
    const isNotExistPrev = currIdx === count - 1 && addIdx === 1

    /** 遷移しない */
    if (!isOverThreshold || isNotExistPrev || isNotExistNext) {
      return currIdx
    }
    /** 遷移する */
    return currIdx + addIdx
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
    swipeOffset = moveX + "px"
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
    currIdx = getIdxSwipeEnd()
    if (prevIdx !== currIdx) {
      slide()
    }
    /** pointer情報をリセット */
    pointer.startX = 0
    pointer.moveX = 0
    pointer.hold = false
  }
</script>

<div class="carousel">
  <div class="carousel-content">
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
    <div class="carousel-prev-next">
      <button
        class="carousel-prev-next__button --prev"
        on:click={onClickPrevButton}
      >
        <span class="visually-hidden">Prev</span>
      </button>
      <button
        class="carousel-prev-next__button --next"
        on:click={onClickNextButton}
      >
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
  <ul class="carousel-indicator">
    {#each [...new Array(count)] as _, i}
      {@const isActive = currIdx === i}
      <li class="carousel-indicator__item">
        <button
          class={[
            `carousel-indicator__button`,
            isActive ? "--active" : "",
          ].join(" ")}
          on:click={e => onClickIndicator(e, i)}
        >
          <span class="visually-hidden">{i + 1}</span>
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
  /** Base rule */
  button {
    appearance: none;
    border: none;
    padding: 0;
  }

  button:hover {
    cursor: pointer;
  }

  /** Utility */
  .visually-hidden {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  .carousel {
  }

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

  .carousel-content {
    position: relative;
  }

  .carousel-prev-next__button {
    --arrow-color: #fff;
    width: 25px;
    height: 25px;
    position: absolute;
    top: 50%;
    border-top: 3px solid var(--arrow-color);
    border-right: 3px solid var(--arrow-color);
    transform: translateY(-50%) rotate(var(--rotate));
    background-color: transparent;
  }

  .carousel-prev-next__button.--prev {
    --rotate: -135deg;
    left: 2.5%;
  }

  .carousel-prev-next__button.--next {
    --rotate: 45deg;
    right: 2.5%;
  }

  .carousel-indicator {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .carousel-indicator__item {
    /** heightを子要素にfitさせる */
    display: flex;
  }

  .carousel-indicator__button {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #457703;
  }

  .carousel-indicator__button:hover,
  .carousel-indicator__button.--active {
    background-color: #b25938;
  }
</style>
