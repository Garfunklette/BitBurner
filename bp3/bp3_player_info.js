/** @param {NS} ns */
import * as hPurchase from "bp3_helpers_purchase.js"
import * as hAugs from "bp3_helpers_augs.js"
import * as hFactions from "bp3_helpers_factions.js"
import * as hPlayer from "bp3_helpers_player.js"

export async function main(ns) {
	ns.disableLog('ALL')

	//looping version:
	//get all augs with wanted stats
	//sum reptime by faction
	//sort factions by reptime (lowest to highest)
	//select faction with lowest reptime
	//attempt to join faction
	//if can't join, go to next

	//choose stat increase (rep / hack / combat / bb)
	let stats = hAugs.HackStats.concat(hAugs.RepStats);
	//choose target aug
	let augsWHacking = hAugs.getAugsWithStat(ns, stats)
	augsWHacking = hAugs.addUtilsToWantedList(ns, augsWHacking);
	////aug with lowest remaining rep req
	augsWHacking.sort((a, b) => a.aRepTime - b.aRepTime);

	let repAchievedNames = augsWHacking.filter(el => el.aRepTime <= 0).map(function (a) { return a.aName });

	let sList = hAugs.getShoppingList(ns, augsWHacking); //removes owned
	sList = sList.filter(el => repAchievedNames.indexOf(el.aName) < 0);
	sList.sort((a, b) => a.aRepTime - b.aRepTime);

	let factionList = []
	for (let f of sList) {
		if (factionList.includes(f.aFaction) === false) {
			factionList.push(f.aFaction);
		}
	}
	let factionRepTime = [];
	for (let g of factionList) {
		factionRepTime.push({ fName: g, fRepTime: 0 });
		for (let h of sList) {
			if (h.aFaction === g) {
				let fIndex = factionRepTime.findIndex(el => el.fName === g);
				factionRepTime[fIndex].fRepTime = factionRepTime[fIndex].fRepTime + h.aRepTime;
			}
		}
	}
	factionRepTime = factionRepTime.filter(el => el.fRepTime > 0).sort((a, b) => a.fRepTime - b.fRepTime);
	let factionRepTimeList = factionRepTime.map(function (el) { return el.fName })

	ns.print("==========Shopping =============")
	for (let g = 0; g < 10; g++) {
		ns.print(sList[g].aName, " ", sList[g].aFaction)
	}

	//choose faction
	//work on rep 'til goal
	//choose next target
	//	ns.print(getFactionAugs(ns, "CyberSec"));
	//ns.print(hAugs.HackStats);
	//ns.print(augsWHacking);
	//ns.print(ns.singularity.getAugmentationStats(augsWHacking[2]))
	let availableFactions = ns.getPlayer().factions.concat(ns.singularity.checkFactionInvitations())
	let availableHAugs = sList.filter(el => availableFactions.indexOf(el.aFaction) > -1);
	//ns.print(Object.keys(availableHAugs[0]))
	availableHAugs = availableHAugs.filter(el => el.aName !== "NeuroFlux Governor");
	ns.print("==========Work List=============")

	availableHAugs.sort((a, b) => a.aRepTime - b.aRepTime);
	for (let j of availableHAugs) {
		ns.print(j)
	}
	if (availableHAugs.length > 0) {
		let choice = availableHAugs[0];
		ns.print("Choice " + choice)
	} else {
		//check for company factions

		//else do crimes
	}


	ns.print("========simulated Purchase=========")
	let sim = hPurchase.simulatePurchase(ns, hAugs.getShoppingList(ns, augsWHacking));
	sim.sort((a, b) => b.aPrice - a.aPrice)
	for (let i of sim) {
		ns.print(i.aName, " ", i.aFaction, " ", i.aScore / i.aPrice * 1000);
	}

	ns.print(hAugs.getTotalAugCost(ns, sim.map(function (el) { return el.aName })));


	ns.print("===========rep reached========")
	let repAchievedCost = 0;
	let repAchievedAlreadyListed = [];
	let repAchievedMulti = 1;
	let owned = ns.singularity.getOwnedAugmentations(true);
	repAchievedNames = repAchievedNames.filter(el => owned.indexOf(el) < 0);
	repAchievedNames.sort((a, b) => ns.singularity.getAugmentationPrice(b) - ns.singularity.getAugmentationPrice(a));
	for (let i of repAchievedNames) {
		if (repAchievedAlreadyListed.indexOf(i) < 0) {
			ns.print(i, " ", ns.nFormat(ns.singularity.getAugmentationPrice(i), "0.00a"), " ", ns.nFormat(ns.singularity.getAugmentationPrice(i) * repAchievedMulti, "0.00a"));
			repAchievedCost = repAchievedCost + ns.singularity.getAugmentationPrice(i) * repAchievedMulti;
			repAchievedAlreadyListed.push(i)
			repAchievedMulti = repAchievedMulti * 2
		}
	}
	if (repAchievedCost > ns.getServerMoneyAvailable("home") && repAchievedCost < 25e6) {
		hPlayer.doBestCrime(ns, "money", repAchievedCost)
	}
	ns.print("Total goal: " + ns.nFormat(repAchievedCost, "0.00a"))

	//	ns.print(ns.singularity.getAugmentationStats("Wired Reflexes"));
	//	for(let i of sim) {
	//		ns.singularity.purchaseAugmentation(i.aFaction,i.aName);
	//	}

}