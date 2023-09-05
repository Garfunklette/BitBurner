/** @param {NS} ns */

import { FactionNames } from "bp3_data_factions.js"
import { factionCheck, CompanyFactions } from "bp3_helpers_factions.js"

export function getFactionAugs(ns, faction) {
	ns.singularity.getAugmentationsFromFaction(faction);
}

export function getFactionShoppingList(ns,stats=HackStats.concat(RepStats)){
	//choose target aug
	let augsWHacking = getAugsWithStat(ns, stats)
	augsWHacking = addUtilsToWantedList(ns, augsWHacking);
	////aug with lowest remaining rep req
	augsWHacking.sort((a, b) => a.aRepTime - b.aRepTime);

	let repAchievedNames = augsWHacking.filter(el => el.aRepTime <= 0).map(function (a) { return a.aName });

	let sList = getShoppingList(ns, augsWHacking); //removes owned
	sList = sList.filter(el => repAchievedNames.indexOf(el.aName) < 0);
	sList.sort((a, b) => a.aRepTime - b.aRepTime);

	let factionList = []
	for (let f of sList) {
		if (factionList.includes(f.aFaction) === false) {
			factionList.push(f.aFaction);
		}
	}
	return factionList;
}

export function getAugFactions(ns, aug, stats) {
	let allAugs = getAllAugs(ns, Object.values(FactionNames), stats);
	let fAugs = allAugs.filter(el => el.aName === aug);
	let augFactions = [];
	for (let i of fAugs) {
		if (augFactions.indexOf(i.aFaction) < 0) {
			augFactions.push(i.aFaction)
		}
	}
	return augFactions;
}

export function getAugScore(ns, augName, stats) {
	let augStats = ns.singularity.getAugmentationStats(augName);
//	ns.print(augStats);
	let appStats = []
	for (let i of Object.keys(augStats)) {
		if (stats.indexOf(i) > -1) {
			appStats.push(augStats[i])
		}
	}
//	ns.print(appStats);
	let score = appStats.reduce((acc, curr) => acc * curr, 1);
//	ns.print(score);
	return score
}

export function getTotalAugCost(ns, augList) {
	//	ns.print("starting getTotalAugCost");
	//	ns.print(augList);
	augList.sort((a, b) => ns.singularity.getAugmentationPrice(b) - ns.singularity.getAugmentationPrice(a))
	let mult = 1;
	let totalAugCost = 0;
	for (let i of augList) {
		totalAugCost = totalAugCost + ns.singularity.getAugmentationPrice(i) * mult;
		mult = mult * 2;
	}
	return totalAugCost;
}

export function getAugInfo(ns, augName, augFaction, stats) {
	let augInfo = {
		aName: augName,
		aFaction: augFaction,
		aPrereqs: ns.singularity.getAugmentationPrereq(augName),
		aTotalRepReq: ns.singularity.getAugmentationRepReq(augName),
		aRepTime: getRepTime(ns, augName, augFaction),
		aPrice: ns.singularity.getAugmentationPrice(augName),
		aScore: getAugScore(ns, augName, stats)
	}
	return augInfo;
}

function getRepTime(ns, augName, augFaction) {
	let companyTime = 0;
	if (!factionCheck(ns, augFaction)) {
		if (CompanyFactions.indexOf(augFaction) > -1) {
			companyTime = (400000 - ns.singularity.getCompanyRep(augFaction)) / (ns.singularity.getCompanyFavor(augFaction) + 1)
		}
	}
	let factionTime = (ns.singularity.getAugmentationRepReq(augName) - ns.singularity.getFactionRep(augFaction)) / (ns.singularity.getFactionFavor(augFaction) + 1)

	let repTime = companyTime + factionTime;

	return repTime;
}

export function getAllAugs(ns, fList, stats) {
	//	ns.print("Starting getAllAugs");
	let allAugs = [];
	for (let i of fList) {
		let fAugs = ns.singularity.getAugmentationsFromFaction(i);
		for (let j of fAugs) {
			//	ns.print(i,j);
			allAugs.push(getAugInfo(ns, j, i, stats))
		}
	}
	return allAugs;
}

export function getShoppingList(ns, wantedList) {
	let owned = ns.singularity.getOwnedAugmentations(true);
	return wantedList.filter(el => owned.indexOf(el.aName) < 0);
}

export function getAugsWithStat(ns, stats) {
	let fList = Object.values(FactionNames)
	let stattedAugs = [];
	let allAugs = getAllAugs(ns, fList, stats);
	for (let i of allAugs) {
		for (let j of stats) {
			if (ns.singularity.getAugmentationStats(i.aName)[j] !== 1) {
				if (!stattedAugs.includes(i))
					stattedAugs.push(i)
			}
		}
	}
	return stattedAugs;
}

export function addUtilsToWantedList(ns, wantedList) {
	for (let i of UtilAugNames) {
		let augFactions = getAugFactions(ns, i, AllStats)
		for (let j of augFactions) {
			let utilAug = getAugInfo(ns, i, j, AllStats)
			utilAug.aScore = 2;
			if (utilAug.aName === "The Red Pill") {
				utilAug.aScore = 200;
			}
			wantedList.push(utilAug);
		}
	}
	return wantedList;
}

function augRepCheck(ns,augName,factionName) {

}



export function getRepAchievedAugs(ns) {
	let stats = HackStats.concat(RepStats);
	let augsWHacking = getAugsWithStat(ns, stats)
	augsWHacking = addUtilsToWantedList(ns, augsWHacking);
	////aug with lowest remaining rep req
	augsWHacking.sort((a, b) => a.aRepTime - b.aRepTime);

	let repAchievedNames = augsWHacking.filter(el => el.aRepTime <= 0).map(function (a) { return a.aName });
	let owned = ns.singularity.getOwnedAugmentations(true);
	repAchievedNames = repAchievedNames.filter(el => owned.indexOf(el) < 0);
	repAchievedNames.sort((a, b) => ns.singularity.getAugmentationPrice(b) - ns.singularity.getAugmentationPrice(a));
	return repAchievedNames;
}

export function getRepAchievedCost(ns) {
let repAchievedCost = 0;
	let repAchievedAlreadyListed = [];
	let repAchievedMulti = 1;
	let repAchievedNames = getRepAchievedAugs(ns);
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
	return repAchievedCost
}

export const AllStats = ["hacking", "hacking_exp", "hacking_chance", "hacking_speed", "hacking_grow","hacking_money", "charisma", "charisma_exp", "company_rep", "faction_rep", "strength", "strength_exp", "defense", "defense_exp", "dexterity", "dexterity_exp", "agility", "agility_exp", "crime_success", "crime_money"]
export const HackStats = ["hacking", "hacking_exp", "hacking_chance", "hacking_speed", "hacking_grow","hacking_money"]
export const RepStats = ["charisma", "charisma_exp", "company_rep", "faction_rep"]
export const CrimeStats = ["strength", "strength_exp", "defense", "defense_exp", "dexterity", "dexterity_exp", "agility", "agility_exp", "crime_success", "crime_money"]

export const UtilAugNames = ["The Red Pill", "CashRoot Starter Kit", "Neuroreceptor Management Implant",]

export async function main(ns) {
/*	let stats = HackStats.concat(RepStats)
	let allAugs = getAllAugs(ns, ["CyberSec", "BitRunners", "Sector-12"], stats);
	allAugs.sort((a, b) => a.aName.localeCompare(b.aName))
	for (let i of allAugs) {
		ns.print(i.aName, " ", i.aFaction)
	}
	ns.print(ns.singularity.getAugmentationStats(allAugs[0].aName))
*/

ns.print(getRepAchievedAugs(ns))
ns.print(getRepAchievedCost(ns))

}