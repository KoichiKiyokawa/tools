<script lang="ts">
  import type { State } from "../utils"

  export let character: string
  export let state: State | "empty" = "empty"
</script>

<div role="button" class="tile {state}" on:click>
  {character}
</div>

<style>
  .tile {
    --tile-text-color: white;
    height: 62px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    line-height: 2rem;
    font-weight: bold;
    vertical-align: middle;
    box-sizing: border-box;
    color: var(--tile-text-color);
    text-transform: uppercase;
    user-select: none;
  }
  .tile.absent {
    background-color: #3a3a3c;
  }
  .tile.present {
    background-color: #b59f3b;
  }
  .tile.correct {
    background-color: #538d4e;
  }
  .tile.empty {
    border: 2px solid #3a3a3c;
  }
  .tile:not(.empty) {
    cursor: pointer;
  }
</style>
