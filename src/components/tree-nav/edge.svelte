<script lang="ts">
  export let subTreeTitle: string
</script>

<!-- svelte-ignore a11y-role-has-required-aria-props -->
<li role="presentation">
  <button
    role="treeitem"
    aria-expanded="false"
    aria-owns={`${subTreeTitle}-subtree`}
  >
    {subTreeTitle}
  </button>
  <ul id={`${subTreeTitle}-subtree`} role="group" aria-label={subTreeTitle}>
    <slot />
  </ul>
</li>

<style>
  [aria-expanded="false"] ~ ul {
    display: none;
  }
</style>
