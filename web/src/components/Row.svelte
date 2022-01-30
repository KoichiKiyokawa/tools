<script lang="ts">
  import { COLUMN_COUNT } from "../constants"
  import { transitState, WordleHint } from "../utils"
  import Tile from "./Tile.svelte"

  /** @bind */
  export let hints: (WordleHint | null)[]
  export let focus: boolean = false

  $: if (focus) dummyInputElement?.focus()

  let inputing: string = ""
  let dummyInputElement: HTMLInputElement

  $: handleInputChange(inputing)

  function handleInputChange(_inputing: string) {
    if (_inputing.length > 5) inputing = _inputing.substring(0, 5)

    const characters: string[] = inputing.split("")
    const newHints = characters.map((char, i) => ({
      character: char,
      index: i,
      state: hints?.[i]?.state ?? "absent",
    }))
    hints = [...newHints, ...Array(COLUMN_COUNT - characters.length).fill(null)]
  }
</script>

<svelte:window
  on:keydown={(e) => {
    if (focus && /[a-z]/.test(e.key)) dummyInputElement?.focus()
  }}
/>

<label>
  <input
    bind:this={dummyInputElement}
    bind:value={inputing}
    disabled={!focus}
    class="dummy-input"
  />
  <div class="row" class:focus on:click>
    {#each hints as hint}
      <Tile
        character={hint?.character ?? ""}
        state={hint?.state ?? "empty"}
        on:click={() => {
          if (hint !== null) hint.state = transitState(hint.state)
        }}
      />
    {/each}
  </div>
</label>
hoge

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
    width: 0;
    height: 0;
  }
</style>
