<script lang="ts">
  interface Content {
    summary: string[]
    details: string[]
  }

  export let content: Content
  export let id: string
  export let key: number

  let opened = false

  const onSummaryClick = () => {
    opened = !opened
  }
</script>

<section class="gm-disclosure">
  <h3 class="gm-disclosure__summary">
    <button
      id={`${id}-disclosure-summary-${key}`}
      aria-controls={`${id}-disclosure-detail-${key}`}
      aria-expanded={opened}
      on:click={onSummaryClick}
    >
      {#each content.summary as word}
        <span>{word}</span>
      {/each}
    </button>
  </h3>
  <div
    class="gm-disclosure__detail"
    id={`${id}-disclosure-detail-${key}`}
    data-expanded={opened}
  >
    {#each content.details as paragraph}
      <p>{paragraph}</p>
    {/each}
  </div>
</section>

<style>
  .gm-disclosure {
    border-bottom: 1px solid #ccc;
    margin-inline: 1rem;
  }

  .gm-disclosure__summary {
    font-size: 1rem;
    font-weight: normal;
  }

  .gm-disclosure__summary button {
    display: inline-flex;
    gap: 1rem;
    width: 100%;
    padding: 20px 50px 20px 20px;
  }

  .gm-disclosure__detail {
    background: #f3f3f3;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .gm-disclosure__detail p {
    margin: 0;
    padding: 0;
  }

  .gm-disclosure__detail[data-expanded="false"] {
    display: none;
  }
</style>
