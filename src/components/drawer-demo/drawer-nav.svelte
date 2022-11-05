<script lang="ts">
  import BurgerButton from "@/components/drawer-demo/burger-button.svelte"
  let opened = false

  const toggle = () => (opened = !opened)
</script>

<BurgerButton {opened} on:click={toggle} />
