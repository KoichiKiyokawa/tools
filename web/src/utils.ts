export async function fetchFiveLengthWords() {
  const allEnglishWords = await fetch(
    "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt"
  )
    .then((r) => r.text())
    .then((r) => r.split("\r\n"))

  const fiveLengthWords = allEnglishWords.filter((word) => word.length === 5)
  return fiveLengthWords
}

const STATES = ["absent", "present", "correct"] as const
export type State = typeof STATES[number]

export function transitState(state: State): State {
  return STATES[(STATES.indexOf(state) + 1) % STATES.length]
}

export type WordleHint = {
  character: string
  state: State
  index: number
}

export function updateCandidates(
  currentCandidates: string[],
  wordleHints: WordleHint[]
): string[] {
  return currentCandidates.filter((word) =>
    wordleHints.every((hint) => {
      if (hint.state === "present")
        return (
          word.includes(hint.character) &&
          word.indexOf(hint.character) !== hint.index
        )
      else return word.indexOf(hint.character) === hint.index
    })
  )
}

// search for words that using the characters user has not typed.
export function getNextInputRecommendations(
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
