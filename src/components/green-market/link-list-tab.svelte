<script lang="ts">
  interface Link {
    url: string
    label: string
  }

  interface TabItem {
    id: string
    title: string
    links: Link[]
  }

  interface TabContents {
    title: string
    items: TabItem[]
  }

  export let contents: TabContents

  let activeIdx = 0

  const onClickTab = (idx: number) => {
    if (activeIdx === idx) return
    activeIdx = idx
  }
</script>

<div class="gm-tabs">
  <ul class="gm-tabs-tablist" role="tablist" aria-label={contents.title}>
    {#each contents.items as { id, title }, i}
      {@const isActive = activeIdx === i}
      <li class="gm-tabs-tablist__item" role="presentation">
        <button
          type="button"
          role="tab"
          id={`gm-tab-${id}`}
          aria-controls={`gm-tabpanel-${id}`}
          aria-selected={isActive}
          tabIndex={isActive ? 0 : -1}
          on:click={() => onClickTab(i)}
        >
          {title}
        </button>
      </li>
    {/each}
  </ul>
  <div class="gm-tabs-panels">
    {#each contents.items as { id, links }, i}
      {@const isActive = activeIdx === i}
      <div
        class="gm-tabs-panel"
        id={`gm-tabpanel-${id}`}
        role="tabpanel"
        aria-labelledby={`gm-tab-${id}`}
        aria-hidden={!isActive}
        tabIndex={isActive ? 0 : -1}
      >
        <ul class="gm-tabs-panel__content gm-category-links">
          {#each links as { url, label }}
            <li class="gm-category-links__item">
              <a href={url}>{label}</a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</div>

<style>
  .gm-tabs {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .gm-tabs-tablist {
    display: flex;
  }

  .gm-tabs-tablist__item {
    flex-grow: 1;
    text-align: center;
  }

  .gm-tabs-tablist__item button {
    appearance: none;
    background-color: transparent;
    border: none;
    padding: 10px;
    width: 100%;
  }

  .gm-tabs-tablist__item button[aria-selected="true"] {
    border-bottom: #457703 2px solid;
  }

  .gm-tabs-panel[aria-hidden="true"] {
    display: none;
  }

  .gm-category-links__item a {
    display: block;
    padding: 10px;
    padding-left: 20px;
    border-bottom: 1px solid #ccc;
  }

  .gm-category-links__item a:hover {
    background: #efefef;
  }
</style>