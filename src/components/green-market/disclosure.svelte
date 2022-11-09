<script lang="ts">
  interface Content {
    summary: string[]
    details: string[]
  }

  export let contents: Content[]
  export let id: string

  let openedIdx: number[] = []

  const onSummaryClick = (idx: number) => {
    if (openedIdx.includes(idx)) {
      openedIdx = openedIdx.filter(i => i !== idx)
    } else {
      openedIdx = [...openedIdx, idx]
    }
  }
</script>

<div class="gm-disclosures">
  {#each contents as { summary, details }, i}
    {@const opened = openedIdx.includes(i)}
    <section class="gm-disclosure-content">
      <h3 class="gm-disclosure-content__summary">
        <button
          id={`${id}-disclosure-summary-${i}`}
          aria-controls={`${id}-disclosure-detail-${i}`}
          aria-expanded={opened}
          on:click={() => onSummaryClick(i)}
        >
          {#each summary as word}
            <span>{word}</span>
          {/each}
        </button>
      </h3>
      <div
        class="gm-disclosure-content__detail"
        id={`${id}-disclosure-detail-${i}`}
        data-expanded={opened}
      >
        {#each details as paragraph}
          <p>{paragraph}</p>
        {/each}
      </div>
    </section>
  {/each}
</div>

<style>
  .gm-disclosures {
    margin-inline: 1rem;
  }

  .gm-disclosure-content {
    border-bottom: 1px solid #ccc;
  }

  .gm-disclosure-content__summary {
    font-size: 1rem;
    font-weight: normal;
  }

  .gm-disclosure-content__summary button {
    display: inline-flex;
    gap: 1rem;
    width: 100%;
    padding: 20px 50px 20px 20px;
  }

  .gm-disclosure-content__detail {
    background: #f3f3f3;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .gm-disclosure-content__detail p {
    margin: 0;
    padding: 0;
  }

  .gm-disclosure-content__detail[data-expanded="false"] {
    display: none;
  }
</style>
