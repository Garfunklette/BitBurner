/** @param {NS} ns */
import * as hFactions from "bp3_helpers_factions.js"
import * as hAugs from "bp3_helpers_augs.js"

export async function main(ns) {
	let aFactions = hAugs.getFactionShoppingList(ns,hAugs.AllStats);
	for (let i of aFactions) {
		hFactions.getInvite(ns, i)
	}
}