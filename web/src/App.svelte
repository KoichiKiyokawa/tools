<script lang="ts">
  import { onMount } from "svelte"
  import Row from "./components/Row.svelte"
  import { COLUMN_COUNT, ROW_COUNT } from "./constants"
  import {
    fetchFiveLengthWords,
    getNextInputRecommendations,
    updateCandidates,
    WordleHint,
  } from "./utils"

  let fiveLengthWords: string[] = []
  let candidates: string[] = []
  let allStepHints: (WordleHint | null)[][] = Array(ROW_COUNT).fill(
    Array(COLUMN_COUNT).fill(null)
  )
  let recommendations: string[] = []

  $: currentStepHints = allStepHints[allStepHints.length - 1].flatMap(
    (hint) => hint ?? []
  )

  $: alreadyTypedCharacters = [
    ...new Set(allStepHints.flat().flatMap((hint) => hint?.character ?? [])),
  ]

  let loading = true
  onMount(() => {
    fetchFiveLengthWords()
      .then((words) => {
        fiveLengthWords = words
        candidates = words
      })
      .catch((err) => {
        console.error(err)
        alert("Failed to fetch words")
      })
      .finally(() => (loading = false))
  })

  let focusedFlags: boolean[] = [true, ...Array(ROW_COUNT - 1).fill(false)]

  function solve() {
    candidates = updateCandidates(candidates, currentStepHints)
    recommendations = getNextInputRecommendations(
      fiveLengthWords,
      alreadyTypedCharacters
    )
  }

  $: console.log(allStepHints)
</script>

{#each allStepHints as hints, rowIndex}
  <Row
    bind:hints
    focus={focusedFlags[rowIndex]}
    on:click={() => {
      if (
        rowIndex > 0 &&
        allStepHints[rowIndex - 1].some((hint) => hint === null)
      )
        return // return if the previous row is not inputed

      focusedFlags = focusedFlags.map((_, i) => i === rowIndex)
    }}
  />
{/each}

{#if loading}
  <p>Loading...</p>
{:else}
  <h2>candidates</h2>
  <ul>
    {#each candidates.slice(0, 10) as candidate}
      <li>{candidate}</li>
    {/each}
  </ul>

  <h2>recommendations for the next input</h2>
  <ul>
    {#each recommendations as recommendation}
      <li>{recommendation}</li>
    {/each}
  </ul>
{/if}

<style>
  :global(*) {
    box-sizing: border-box;
  }
</style>
