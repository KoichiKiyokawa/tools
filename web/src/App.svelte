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

  let inputElement: HTMLInputElement
  let inputing: string = ""

  let loading = true
  onMount(() => {
    inputElement.focus()
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

  $: handleInputChange(inputing)

  function handleInputChange(_inputing: string) {
    if (_inputing.length > 5) inputing = _inputing.substring(0, 5)

    const newHints = inputing.split("").map((char, i) => ({
      character: char,
      index: i,
      state: currentStepHints?.[i]?.state ?? "absent",
    }))

    allStepHints = [...allStepHints.slice(0, -1), newHints]
  }

  function solve() {
    candidates = updateCandidates(candidates, currentStepHints)
    recommendations = getNextInputRecommendations(
      fiveLengthWords,
      alreadyTypedCharacters
    )
    allStepHints = [...allStepHints, []]
    inputing = ""
    inputElement.focus()
  }
</script>

<form on:submit|preventDefault={solve}>
  <input bind:this={inputElement} bind:value={inputing} class="" />
  <button disabled={inputing.length !== 5}>solve</button>
</form>

{#each allStepHints as hints}
  <Row bind:hints />
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
