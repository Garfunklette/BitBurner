/** @param {NS} ns */

import { FactionNames } from "bp3_data_factions.js"
import { ServerMetadata } from "bp3_data_servers.js";
import { connectToServerAndBackdoor } from "bp3_helpers_terminal.js"

export async function getInvite(ns, faction) {
	ns.print("Start getInvite ", faction)
	if (!factionCheck(ns, faction)) {
		if (HackFactions.includes(faction)) {
			let server = getServerNameFromFaction(ns, faction);
			ns.print("server name " + server)
			await connectToServerAndBackdoor(ns, server)
		}
		let locations = []
		for (let i of LocationFactions) {
			if (i.lFactions.includes(faction)) {
				locations.push(i.lName)
			}
		}
		ns.print(locations);
		if ((locations.length > 0) && ns.getServerMoneyAvailable("home") > 50200000 && !enemyCheck(ns, faction)) {

			await ns.singularity.travelToCity(locations[0]);
		}
		if (CompanyFactions.includes(faction) && ns.getHackingLevel() > 275) {
			applyToFactionCompanyJob(ns, faction);
		}
	}
	return factionCheck(ns, faction);
}

export function enemyCheck(ns, faction) {
	const EnemyFactions = [
		{
			fName: "Sector-12",
			fEnemies: ["Chongqing", "Ishima", "New Tokyo", "Volhaven"]
		},
		{
			fName: "Aevum",
			fEnemies: ["Chongqing", "Ishima", "New Tokyo", "Volhaven"]
		},
		{
			fName: "Chongqing",
			fEnemies: ["Sector-12", "Aevum", "Volhaven"]
		},
		{
			fName: "Ishima",
			fEnemies: ["Sector-12", "Aevum", "Volhaven"]
		},
		{
			fName: "New Tokyo",
			fEnemies: ["Sector-12", "Aevum", "Volhaven"]
		},
		{
			fName: "Volhaven",
			fEnemies: ["Sector-12", "Aevum", "Chongqing", "Ishima", "New Tokyo"]
		},
		{
			fName: "Tian Di Hui",
			fEnemies: []
		},
		{
			fName: "Tetrads",
			fEnemies: []
		}
	]
	let playerFactions = ns.getPlayer().factions
	let enemies = EnemyFactions.find(el => el.fName === faction).fEnemies
	for (let i of playerFactions) {
		if (enemies.indexOf(i) > -1) {
			return true;
		}
	}
	return false;
}

export function inviteCheck(ns, faction) {
	let invites = ns.singularity.checkFactionInvitations()
	if (invites.includes(faction)) {
		return true
	}
	return false;
}

export function joinedFactionCheck(ns, faction) {
	let joined = ns.getPlayer().factions;
	if (joined.includes(faction)) {
		return true;
	}
	return false;
}

export function factionCheck(ns, faction) {
	let availableFactions = ns.getPlayer().factions.concat(ns.singularity.checkFactionInvitations())
	if (availableFactions.indexOf(faction) > -1) {
		return true;
	}
	return false;
}

function getKeyByValue(ns, object, value) {
	ns.print("start getKeyByValue ", object, value)
	return Object.keys(object).find(key => object[key] === value);
}

function getServerNameFromFaction(ns, faction) {
	ns.print("start getServerNameFromFaction ", faction)
	let fName = Object.keys(FactionNames).find(key => FactionNames[key] === faction)
	ns.print("fName: " + fName)
	let server = (ServerMetadata).find(el => el.organizationName === faction)

	ns.print("server meta " + server);
	let sName = server.hostname
	ns.print(server.hostname)
	return sName;
}

export function applyToFactionCompanyJob(ns, faction) {
	if (factionCheck(ns, faction) === false) {
		ns.singularity.applyToCompany(faction, "IT");
	}
}

export function execWorkForCompany(ns, faction) {
	if(ns.getPlayer().jobs.includes(faction)) {
	ns.exec("bp3_player_workForCompany.js", "home", 1, faction, 400000);
	}
}

export function getDonationAmtNeeded(ns, factionName, augName) {
	//ns.print(factionName, augName)
	let factionRep = ns.singularity.getFactionRep(factionName);
	//ns.print("Faction rep "+factionRep)
	let augRep = ns.singularity.getAugmentationRepReq(augName);
	//ns.print("Aug rep "+augRep)
	let factionFavor = ns.singularity.getFactionFavor(factionName);
	//ns.print("Faction favor "+factionFavor)
	let donationAmt = -1;
	if (factionFavorCheck(ns, factionName)) {
		if (factionRep < augRep) {
		//	ns.print("Rep gain from donation of 1"+donGain1)
			donationAmt = Math.ceil((augRep - factionRep)/ns.formulas.reputation.repFromDonation(1, ns.getPlayer()));
			//ns.print("Donation amt "+donationAmt)
	} else ns.print(`Sufficient rep with ${factionName} to purchase ${augName}`);
	} else {
		ns.print(`Faction favor ${ns.formatNumber(factionFavor, "0.00a")} / ${ns.formatNumber(ns.singularity.getFavorToDonate())}`)
	}
	return donationAmt
}

export function factionFavorCheck(ns, faction) {
	if (ns.singularity.getFactionFavor(faction) > ns.getFavorToDonate()) {
		return true;
	}
	return false;
}

export function tryDonateToFactionForAug(ns, factionName, augName) {
	if (factionFavorCheck(ns, factionName)) {
		let donation = getDonationAmtNeeded(ns, factionName, augName);
		ns.print(donation)
		if (donation < (ns.getServerMoneyAvailable("home") - ns.singularity.getAugmentationPrice(augName))) {
			ns.singularity.donateToFaction(factionName, donation);
		} else {
			let totalMoneyReq = ns.formatNumber(ns.singularity.getAugmentationPrice(augName) + donation - ns.getServerMoneyAvailable("home"), "0.00a")
			ns.print(`Get ${totalMoneyReq} more money`)
		}
	} else {
		ns.print("need more favor with faction " + factionName)
	}
}

function getAvailWorkTypes(ns, faction) {
	let currentWork = ns.singularity.getCurrentWork();
	let availWorkTypes = []
	for (let i of WorkTypes) {
		if (ns.singularity.workForFaction(faction, i, false)) {
			availWorkTypes.push(i)
		}
	}
	return availWorkTypes;
}

export function getBestWorkType(ns, factionName, player = ns.getPlayer(), availWorkTypes = WorkTypes) {
	let bestRepGain = 0;
	let bestWorkType = availWorkTypes[0]
	let factionFavor = ns.singularity.getFactionFavor(factionName);
	for (let i of availWorkTypes) {
		let fGains = ns.formulas.work.factionGains(player, i, factionFavor)
		//ns.print(i,fGains)
		if (fGains.reputation > bestRepGain) {
			bestRepGain = fGains.reputation;
			bestWorkType = i;
		}
	}
	return bestWorkType;
}

export const LocationFactions = [
	{ lName: "Sector-12", lFactions: ["Sector-12"] },
	{ lName: "Aevum", lFactions: ["Aevum"] },
	{ lName: "Chongqing", lFactions: ["Chongqing", "Tian Di Hui", "Tetrads"] },
	{ lName: "Ishima", lFactions: ["Ishima", , "Tian Di Hui", "Tetrads"] },
	{ lName: "New Tokyo", lFactions: ["New Tokyo", "Tian Di Hui", "Tetrads"] },
	{ lName: "Volhaven", lFactions: ["Volhaven"] }
]

export const HackFactions = ["CyberSec", "NiteSec", "The Black Hand", "BitRunners"]
export const CompanyFactions = ["NWO", "OmniTek Incorporated", "KuaiGong International", "ECorp", "Bachman & Associates", "Four Sigma", "Clarke Incorporated", "Blade Industries"];
export const WorkTypes = ["hacking", "field", "security"]

export async function main(ns) {
	let targets = HackFactions
	for (let i of targets) {
		ns.print(await getInvite(ns, i));
	}
}