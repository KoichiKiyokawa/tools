import "zx/globals"
;(async function () {
  const allEnglishWords = await fetch(
    "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt"
  )
    .then((r) => r.text())
    .then((r) => r.split("\r\n"))

  const fiveLengthWords = allEnglishWords.filter((word) => word.length === 5)

  console.log(`start wordle!!!`)
  console.log("Please input the response from the wordle website.")
  console.log(
    "If green, you should enclose with `[]`, if yellow, you should enclose with `()`"
  )
  console.log("For example, wo(r)l[d]")

  let candidates = fiveLengthWords
  let alreadyTypedCharacters: string[] = []
  while (true) {
    const wordleResponse: string = await question("> ")
    try {
      const currentStepHints: WordleHint[] = parseWordleResponse(wordleResponse)
      alreadyTypedCharacters = [
        ...new Set([
          ...alreadyTypedCharacters,
          ...currentStepHints.map((hint) => hint.character),
        ]),
      ]
      candidates = updateCandidates(candidates, currentStepHints)
      console.log("candidates:")
      console.log(candidates)
      console.log("recommendations for next the input:")
      console.log(
        getNextInputRecommendations(fiveLengthWords, alreadyTypedCharacters)
      )
    } catch (err) {
      console.log(chalk.red(err.message))
    }
  }
})()

type WordleHint = { character: string } & (
  | { index: number }
  | { notIndex: number }
)

/**
 * @param response e.g `wo(r)l[d]`
 * @returns
 * ```
 * [
 *   { character: 'w', index: -1 },
 *   { character: 'o', index: -1 },
 *   { character: 'r', notIndex: 2 },
 *   { character: 'l', index: -1 },
 *   { character: 'd', index: 4 }
 * ]
 * ```
 */
function parseWordleResponse(response: string): WordleHint[] {
  if (response.replace(/\(|\)|\[|\]/g, "").length !== 5)
    throw Error("invalid input. length must be 5")

  const wordleHints: WordleHint[] = []
  let index = 0
  let symbolCount = 0 // count of `[`, `]`, `(`, `)`
  let isAnyParenthesisOpening = false
  for (const char of response) {
    if (["(", ")", "[", "]"].includes(char)) symbolCount++
    if (["(", "["].includes(char)) isAnyParenthesisOpening = true

    if (char === "]") {
      if (response[index - 2] !== "[")
        throw Error("parse error. `]` should start with `[`")

      // closing green
      wordleHints.push({
        character: response[index - 1],
        index: index - symbolCount,
      })
      isAnyParenthesisOpening = false
    } else if (char === ")") {
      if (response[index - 2] !== "(")
        throw Error("parse error. `)` should start with `(`")

      // closing yellow
      wordleHints.push({
        character: response[index - 1],
        notIndex: index - symbolCount,
      })
      isAnyParenthesisOpening = false
    } else if (!isAnyParenthesisOpening) {
      // any other ordinal character
      wordleHints.push({ character: char, index: -1 })
    }

    index++
  }

  return wordleHints
}

function updateCandidates(
  currentCandidates: string[],
  wordleHints: WordleHint[]
): string[] {
  return currentCandidates.filter((word) =>
    wordleHints.every((hint) => {
      if ("index" in hint) return word.indexOf(hint.character) === hint.index
      else
        return (
          word.includes(hint.character) &&
          word.indexOf(hint.character) !== hint.notIndex
        )
    })
  )
}

// search for words that using the characters user has not typed.
function getNextInputRecommendations(
  words: string[],
  alreadyTypedCharacters: string[],
  maxLength: number = 10
): string[] {
  let topCandidateWithScoreList: { word: string; score: number }[] = []
  for (const word of words) {
    let score = 0
    for (const char of alreadyTypedCharacters) {
      if (!word.includes(char)) score++
    }
    score -= 5 - [...new Set(word)].length // decrease score if the word has duplicate characters
    topCandidateWithScoreList.push({ word, score })
    topCandidateWithScoreList = topCandidateWithScoreList
      .sort((a, b) => b.score - a.score) // sort by desc
      .slice(0, maxLength)
  }

  return topCandidateWithScoreList.map((c) => c.word)
}
