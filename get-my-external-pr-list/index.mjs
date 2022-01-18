import "zx/globals"

const ENDPOINT = "https://api.github.com/search/issues"
const username = "KoichiKiyokawa"
const ignoreOwners = ["KoichiKiyokawa"]

const q = `type:pr author:${username}`
const prList = await fetch(ENDPOINT + "?q=" + q).then((r) => r.json())
const externalPRs = prList.items.filter(
  (pr) =>
    !ignoreOwners.some((owner) =>
      pr.repository_url.startsWith(`https://api.github.com/repos/${owner}`)
    )
)

console.log(externalPRs.map((pr) => pr.pull_request.html_url))
