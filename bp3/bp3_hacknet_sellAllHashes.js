/** @param {NS} ns */
export async function main(ns) {
ns.hacknet.spendHashes("Sell for Money","",Math.floor(ns.hacknet.numHashes()/ns.hacknet.hashCost("Sell for Money")))
}