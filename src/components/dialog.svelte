<script lang="ts">
  let closing = true
  let dialogel: HTMLDialogElement
  const open = () => {
    dialogel.showModal()
    // モーダルが開いた一瞬後に、`--closing` のクラスを削除する
    requestAnimationFrame(() => (closing = false))
  }
  const close = () => {
    // アニメーション完了のタイミングで `close()` を実行
    // `{ once: true }` で実行後にリスナーを自動で削除
    dialogel.addEventListener("transitionend", () => dialogel.close(), {
      once: true,
    })
    // `--closing` のクラスを再び付与し、閉じるアニメーションを実行
    // 2回目以降もアニメーションされるようになる
    closing = true
  }
  const judgeOutsideClick = (e: MouseEvent | TouchEvent) => {
    if (e.target === dialogel) {
      close()
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
  bind:this={dialogel}
  class={closing ? "--closing" : ""}
  on:click={judgeOutsideClick}
>
  <div class="modal__inner">
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni quia
      molestias ipsam mollitia similique rerum amet obcaecati vitae
    </p>
    <button on:click={close}>Close</button>
  </div>
</dialog>

<button on:click={open}> Open </button>

<style>
  /** 閉じている時 */
  dialog.--closing {
    opacity: 0;
    transform: scale(0.9);
  }

  dialog {
    box-sizing: border-box;
    width: calc(100vw - 32px);
    max-width: 640px;
    border: 0;
    /** innerを広げるためにpaddingは消しておく */
    padding: 0;
    /** ぬるっと現れる */
    transition: opacity 0.5s, transform 0.5s;
  }

  dialog.--closing::backdrop {
    opacity: 0;
  }

  dialog::backdrop {
    opacity: 0.5;
    background: #000;
    /** fadeIn */
    transition: opacity 0.5s;
  }

  /** 背景クリックで閉じるために、内部コンテンツを囲んで全面に広げる */
  .modal__inner {
    /** paddingはinnerに指定 */
    padding: 16px;
  }
</style>
