/** @param {NS} ns */

import * as hAugs from "bp3_helpers_augs.js"

export function choosePlayerAction(ns) {
	//purchase list:
	//augs
	//home upgrade RAM
	//home upgrade Core
	//programs
	//pservers
	//stock API's
	//company starter

	//goal resources:
	//money (crime / hacking), 
	//hacking level (uni / faction work)
	//company rep (job work)
	//faction rep (faction work)

}

function getTargetAugList(ns, stats) {
	let augsWStat = hAugs.getAugsWithStat(ns, stats)

	//ns.print(augsWHacking);
	augsWStat.sort((a, b) => a.aRepTime - b.aRepTime);
	//ns.print(ns.singularity.getAugmentationStats(augsWHacking[2]))
	let sList = hAugs.getShoppingList(ns, augsWStat);
	let availableFactions = ns.getPlayer().factions.concat(ns.singularity.checkFactionInvitations())
	let targetAugList = sList.filter(el => (availableFactions.indexOf(el.aFaction)) > -1 && (el.aRepTime > 0));
	let owned = ns.singularity.getOwnedAugmentations(true);
	let repAchievedNames = [];

	let statAugNames = augsWStat.map(function (el) { if (el.aRepTime <= 0) { return el.aName } });
	for (let i of statAugNames) {
		if (repAchievedNames.indexOf(i) < 0) {
			repAchievedNames.push(i);
		}
	}
	targetAugList = targetAugList.filter(el => owned.indexOf(el.aName) < 0 && repAchievedNames.indexOf(el.aName) < 0);
	return targetAugList;
}

export const CRIMELIST = [
	"Assassination",
	"Bond Forgery",
	"Deal Drugs",
	"Grand Theft Auto",
	"Heist",
	"Homicide",
	"Kidnap",
	"Larceny",
	"Mug",
	"Rob Store",
	"Shoplift",
	"Traffick Arms"
]
export function getCrimeScores(ns, stat = "money") {
	let crimeScores = [];
	for (let i of CRIMELIST) {
		let chance = ns.singularity.getCrimeChance(i)
		let stats = ns.singularity.getCrimeStats(i)
		let score = stats[stat] * chance / stats.time;
		crimeScores.push({ cName: i, cScore: score, cTime: stats.time })
	}
	crimeScores.sort((a, b) => b.cScore - a.cScore);
	return crimeScores
}

export function getCrimeStatGain(ns, stat) {
	let crimeScores = [];
	for (let i of CRIMELIST) {
		let chance = ns.singularity.getCrimeChance(i)
		let stats = ns.singularity.getCrimeStats(i)
		let score = stats[stat] * chance / stats.time;
		crimeScores.push({ cName: i, cScore: score, cTime: stats.time })
	}
	crimeScores.sort((a, b) => b.cScore - a.cScore);
	return crimeScores
}

export function doBestCrime(ns, stat = "money", goal) {
	let scores = getCrimeStatGain(ns, stat)
	scores = scores.filter(el => el.cTime < 120000)
	let sleepTime = Math.max(scores[0].cTime * 1.1, 10000);
	ns.print("Time to goal: " + (sleepTime / 1000 * (1 / scores[0].cScore) * goal))
	ns.exec("bp3_player_crime.js", "home", 1, scores[0].cName, stat, goal, sleepTime)
}

export function getBestCrime(ns, stat = "money") {
	let scores = getCrimeStatGain(ns, stat)
	scores = scores.filter(el => el.cTime < 120000)
	return scores[0].cName
}

export function getSCrimeScore(ns,sleeveNo,crime,stat="money") {
	let sleeveInfo = ns.sleeve.getSleeve(sleeveNo);
	ns.print(sleeveInfo);
	let gains = ns.formulas.work.crimeGains(sleeveInfo,crime)
	let chance = ns.formulas.work.crimeSuccessChance(sleeveInfo,crime)
	let time = ns.singularity.getCrimeStats(crime).time;
	let statGain = gains.stat * chance / time;
	return statGain;
}

export function getSBestCrime(ns, sleeveNo,stat = "money") {
	let crimes = CRIMELIST;
	crimes.sort((a,b)=>getSCrimeScore(ns,sleeveNo,b,stat)-getSCrimeScore(ns,sleeveNo,a,stat));
	return crimes[0]
}

export async function main(ns) {
	let sleeveNo = 0;
	let crime = "Heist"
ns.print(getBestCrime(ns,sleeveNo,"money"))

}