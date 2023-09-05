/** @param {NS} ns */
import * as hAugs from "bp3_helpers_augs.js"
import { FactionNames } from "bp3_data_factions.js"

export function repDonations(ns) {
	let augsList = hAugs.getAllAugs(ns, Object.values(FactionNames), hAugs.AllStats);
	//ns.print(augsList)
	if(augsList.length>0)
	for (let i of augsList) {
		donateToRep(ns, i.aName, i.aFaction);
	}
}

export function donateToRep(ns, aug, faction) {
	let playerFactions = ns.getPlayer().factions;
	if (playerFactions.includes(faction)) {
		//	ns.print(aug, faction)
		let neededRep = ns.singularity.getAugmentationRepReq(aug) - ns.singularity.getFactionRep(faction)
		let bribePerRep = 1e9
		if (neededRep > 0) {
			let amt = bribePerRep * neededRep;
			ns.corporation.bribe(faction, amt)
		}
	}
}

export async function main(ns) {
while(true) {
repDonations(ns);
await ns.sleep(10000);
}
}