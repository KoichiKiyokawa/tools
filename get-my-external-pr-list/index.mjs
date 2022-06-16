import "zx/globals";

/** @typedef {{ repository_url: string, pull_request: { html_url: string } }} IssueItem */

const ENDPOINT = "https://api.github.com/search/issues";
const username = "KoichiKiyokawa";
const ignoreOwners = ["KoichiKiyokawa"];

const q = `type:pr author:${username}`;
let page = 1;
/** @type {IssueItem[]} */
const prList = [];
while (1) {
  const res = await fetchPrList(page++);
  if (res.message?.startsWith("API rate limit")) throw Error("API rate limit");
  if (res.items.length === 0) break;
  prList.push(...res.items);
}

const externalPRs = prList.filter(
  (pr) => !ignoreOwners.some((owner) => pr.repository_url.startsWith(`https://api.github.com/repos/${owner}`))
);

console.log(externalPRs.map((pr) => pr.pull_request.html_url));

/**
 * @param {number} page
 * @returns {Promise<{ message?: string, items: IssueItem[] }>}
 */
function fetchPrList(page) {
  return fetch(
    ENDPOINT + "?" + new URLSearchParams({ q, status: "all", owned: "false", per_page: "100", page: String(page) }),
    { headers: { accept: "application/vnd.github.v3+json" } }
  ).then((r) => r.json());
}
