/** @param {NS} ns */

import * as hAugs from "bp3_helpers_augs.js"

export async function main(ns) {
	
		
	while (true) {
	
		let stats = hAugs.HackStats.concat(hAugs.RepStats);
	//choose target aug
	let augsWHacking = hAugs.getAugsWithStat(ns, stats)
	augsWHacking = hAugs.addUtilsToWantedList(ns, augsWHacking);
	////aug with lowest remaining rep req
	augsWHacking.sort((a, b) => a.aRepTime - b.aRepTime);

	let repAchievedNames = augsWHacking.filter(el => el.aRepTime <= 0).map(function (a) { return a.aName });

	let repAchievedCost = 0;
	let repAchievedMulti = 1;
	let repAchievedAlreadyListed = [];

		let owned = ns.singularity.getOwnedAugmentations(true);
		repAchievedNames = repAchievedNames.filter(el => owned.indexOf(el) < 0);
		repAchievedNames.sort((a, b) => ns.singularity.getAugmentationPrice(b) - ns.singularity.getAugmentationPrice(a));
		for (let i of repAchievedNames) {
			if (repAchievedAlreadyListed.indexOf(i) < 0) {
				ns.print(i, " ", ns.formatNumber(ns.singularity.getAugmentationPrice(i), "0.00a"), " ", ns.formatNumber(ns.singularity.getAugmentationPrice(i) * repAchievedMulti, "0.00a"));
				repAchievedCost = repAchievedCost + ns.singularity.getAugmentationPrice(i) * repAchievedMulti;
				repAchievedAlreadyListed.push(i)
				repAchievedMulti = repAchievedMulti * 2
			}
		}
		if (ns.getServerMoneyAvailable("home") > repAchievedCost && repAchievedCost > 0) {
			ns.toast("Can afford all Rep Achieved Augs "+repAchievedNames.length)
		} else {
			ns.toast("Goal money "+ns.formatNumber(repAchievedCost,"0.00a"))
		}
		ns.print("Total goal: " + ns.formatNumber(repAchievedCost, "0.00a"))

		await ns.sleep(60000)
		ns.clearLog();
	}
}