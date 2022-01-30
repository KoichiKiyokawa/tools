<script lang="ts">
  import { transitState, WordleHint } from "../utils"
  import Tile from "./Tile.svelte"

  /** @bind */
  export let hints: (WordleHint | null)[]
  export let focus: boolean = false

  let inputing: string = ""
</script>

<input bind:value={inputing} class="dummy-input" />
<div class="row" class:focus on:click>
  {#each hints as hint}
    <Tile
      character={hint?.character ?? ""}
      state={hint?.state ?? "empty"}
      on:click={() => {
        if (hint) hint.state = transitState(hint.state)
      }}
    />
  {/each}
</div>

<style>
  .row {
    width: 350px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 5px;
  }

  .row.focus {
    outline: 1px solid blue;
  }

  .dummy-input {
    visibility: hidden;
  }
</style>
