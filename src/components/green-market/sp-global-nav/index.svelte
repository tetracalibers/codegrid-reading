<script lang="ts">
  import DrawerNav from "@/components/green-market/drawer-nav/index.svelte"
  import DropdownItem from "./dropdown-item.svelte"
  import Dropdown from "./dropdown.svelte"
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<DrawerNav bgAnimeType={"circle-from-left-top"}>
  <ul>
    <li><a href="#">花束・ブーケ</a></li>
    <li>
      <a href="#">アレンジメント</a>
      <Dropdown>
        <DropdownItem
          img={{ src: "main01.jpg", alt: "" }}
          href="#"
          text="joy"
        />
        <DropdownItem
          img={{ src: "main02.jpg", alt: "" }}
          href="#"
          text="fun"
        />
        <DropdownItem
          img={{ src: "main03.jpg", alt: "" }}
          href="#"
          text="relax"
        />
        <DropdownItem
          img={{ src: "main04.jpg", alt: "" }}
          href="#"
          text="heart"
        />
        <DropdownItem
          img={{ src: "main05.jpg", alt: "" }}
          href="#"
          text="happy"
        />
      </Dropdown>
    </li>
    <li><a href="#">ブリザードフラワー</a></li>
    <li>
      <a href="#">季節限定</a>
      <ul>
        <li><a href="#">クリスマス</a></li>
        <li><a href="#">お正月</a></li>
        <li><a href="#">母の日</a></li>
        <li><a href="#">お歳暮</a></li>
      </ul>
    </li>
  </ul>
</DrawerNav>
