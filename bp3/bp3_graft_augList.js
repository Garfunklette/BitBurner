/** @param {NS} ns */

import * as hAugs from "bp3_helpers_augs.js"

function getHackingGraftList(ns) {
	let wantedList = hAugs.getAugsWithStat(ns, hAugs.HackStats);
	let hackAugs = hAugs.getShoppingList(ns, wantedList)
	let gAugs = ns.grafting.getGraftableAugmentations()
	let hAugsNames = hackAugs.map(function (el) { return el.aName })
	gAugs = gAugs.filter(el => hAugsNames.indexOf(el) > -1)
	gAugs.sort((a, b) => ns.grafting.getAugmentationGraftTime(a) - ns.grafting.getAugmentationGraftTime(b))
	gAugs = gAugs.filter(el => ns.grafting.getAugmentationGraftPrice(el) < ns.getServerMoneyAvailable("home"))
	let repAchievedAugs = hAugs.getRepAchievedAugs(ns);
	gAugs = gAugs.filter(el => repAchievedAugs.indexOf(el) < 0);
	return gAugs
}

export async function main(ns) {
	let gAugs = getHackingGraftList(ns);
	for (let i of gAugs) {
		ns.print(i, " ", ns.formatNumber(ns.grafting.getAugmentationGraftPrice(i), "0.00a"), " ", ns.formatNumber(ns.grafting.getAugmentationGraftTime(i) / (60 * 1000), "0.00a") + " min")
	}

	while (gAugs.length > 0) {
		let cWork = ns.singularity.getCurrentWork();
		if (cWork === null) {
			gAugs = getHackingGraftList(ns)
			if (ns.getPlayer().location !== "New Tokyo") {
				ns.singularity.travelToCity("New Tokyo");
			}
			ns.grafting.graftAugmentation(gAugs[0], false)
			ns.tprint("Started " + gAugs[0])
			ns.tprint("Time required: " + (ns.grafting.getAugmentationGraftTime(gAugs[0])) / 60000 + " minutes");
		} else {
			if (cWork.type !== "GRAFTING") {
				gAugs = getHackingGraftList(ns)
				if (ns.getPlayer().location !== "New Tokyo") {
					ns.singularity.travelToCity("New Tokyo");
				}
				ns.grafting.graftAugmentation(gAugs[0], false)
				ns.tprint("Started " + gAugs[0])
				ns.tprint("Time required: " + (ns.grafting.getAugmentationGraftTime(gAugs[0])) / 60000 + " minutes");
			}
		}
		ns.print(ns.singularity.getCurrentWork())
		ns.print("Time required: " + (ns.grafting.getAugmentationGraftTime(gAugs[0])) / 60000 + " minutes");
		await ns.sleep(60000)
	}
	ns.tprint("All grafts completed")
}