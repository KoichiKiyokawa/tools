import fs from "fs/promises"

const allEnglishWords = await fetch(
  "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt"
)
  .then((r) => r.text())
  .then((r) => r.split("\r\n"))

const fiveLengthWords = allEnglishWords.filter((word) => word.length === 5)
await fs.writeFile(
  "src/dictionary.ts",
  `export const fiveLengthWords = ${JSON.stringify(fiveLengthWords, null, 2)}`
)
