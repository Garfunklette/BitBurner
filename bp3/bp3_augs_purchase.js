/** @param {NS} ns */
import * as hAugs from "bp3_helpers_augs.js";
import { purchaseAugs } from "bp3_helpers_purchase.js"




export async function main(ns) {
	let stats = hAugs.AllStats;
//	let stats = hAugs.HackStats.concat(hAugs.RepStats);
	let augsWHacking = hAugs.getAugsWithStat(ns, stats)
	augsWHacking = hAugs.addUtilsToWantedList(ns, augsWHacking);

	let repAchievedNames = augsWHacking.filter(el => el.aRepTime <= 0).map(function (a) { return a.aName });

	let sList = hAugs.getShoppingList(ns, augsWHacking);

	sList.sort((a, b) => b.aPrice - a.aPrice);

	purchaseAugs(ns, sList);

	stats = hAugs.CombatStats;
	augsWHacking = hAugs.getAugsWithStat(ns, stats)
	augsWHacking = hAugs.addUtilsToWantedList(ns, augsWHacking);

	repAchievedNames = augsWHacking.filter(el => el.aRepTime <= 0).map(function (a) { return a.aName });

	sList = hAugs.getShoppingList(ns, augsWHacking);

	sList.sort((a, b) => b.aPrice - a.aPrice);



	//get wanted augs list
	//set money available
	////get most score for money
	//////prereqs
	//////rep achievable







}