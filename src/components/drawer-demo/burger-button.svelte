<script lang="ts">
  export let opened: boolean
  export let navid: string
</script>

<button
  on:click
  class="burger-btn"
  type="button"
  aria-expanded={opened}
  aria-controls={navid}
>
  <div class="burger-btn-icon">
    <span class="burger-btn-icon__line --line-1" />
    <span class="burger-btn-icon__line --line-2" />
    <span class="burger-btn-icon__line --line-3" />
  </div>
</button>

<style>
  .burger-btn {
    --size: 2rem;
    --lineH: 2px;
    /** sizeから3本線の高さを引いて、上:2 | 間:1 | 間:1 | 下:2 の比率で空白を割り振る */
    --gap: calc((var(--size) - var(--lineH) * 3) / 6);
    --space-2x: calc(var(--size) * 0.45);
    --space-x: calc(var(--space-2x) / 2);
    --space-y: calc(var(--gap) * 2);
    --lineW: calc(var(--size) - var(--space-2x));

    /** reset */
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    padding: 0;
    appearance: none;
    font-size: 1rem;
  }

  .burger-btn-icon {
    width: var(--size);
    height: var(--size);
    background-color: #7895b2;
    padding: var(--space-y) var(--space-x);
    box-sizing: border-box;
    position: relative;
  }

  .burger-btn-icon__line {
    --line-pos: calc(var(--space-y) + (var(--lineH) + var(--gap)) * var(--idx));
    position: absolute;
    left: var(--space-x);
    height: var(--lineH);
    border-radius: 2px;
    background: #fff;
    display: inline-block;
    width: var(--lineW);
    transition: all 0.4s;
  }

  .burger-btn-icon__line.--line-1 {
    --idx: 0;
    top: var(--line-pos);
  }

  .burger-btn-icon__line.--line-2 {
    --idx: 1;
    top: var(--line-pos);
  }

  .burger-btn-icon__line.--line-3 {
    --idx: 2;
    top: var(--line-pos);
  }

  .burger-btn[aria-expanded="true"] .burger-btn-icon__line.--line-1 {
    --idx: 1;
    top: var(--line-pos);
    transform: rotate(-45deg);
  }

  .burger-btn[aria-expanded="true"] .burger-btn-icon__line.--line-2 {
    opacity: 0;
  }

  .burger-btn[aria-expanded="true"] .burger-btn-icon__line.--line-3 {
    --idx: 1;
    top: var(--line-pos);
    transform: rotate(45deg);
  }
</style>
