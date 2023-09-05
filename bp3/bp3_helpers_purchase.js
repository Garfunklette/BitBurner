/** @param {NS} ns */
import * as hAugs from "bp3_helpers_augs.js"
import * as hFactions from "bp3_helpers_factions.js"
import * as hHacknet from "bp3_helpers_hacknet.js"

export function purchaseAugs(ns, augList, bankRoll = ns.getServerMoneyAvailable("home")) {
	augList.sort((a, b) => b.aPrice - a.aPrice);
	for (let i of augList) {
		if (!repCheck(ns, i.aName, i.aFaction)) {
			if (hFactions.factionFavorCheck(ns, i.aFaction)) {
				tryDonateToFactionForAug(ns, i.aFaction, i.aName)
			}
		}
		hHacknet.sellHashesForMoney(ns,i.aPrice);
		ns.singularity.purchaseAugmentation(i.aFaction, i.aName);
	}
}

export function factionCheck(ns, faction) {
	let availableFactions = ns.getPlayer().factions.concat(ns.singularity.checkFactionInvitations())
	if (availableFactions.indexOf(faction) > -1) {
		return true;
	}
	return false;
}

export function repCheck(ns, aug, faction) {
	if (ns.singularity.getAugmentationRepReq(aug) < ns.singularity.getFactionRep(faction)) {
		return true;
	}
	return false;
}

export function simulatePurchase(ns, augList) {
	let money = ns.getServerMoneyAvailable("home");
	let boughtList = [];

	augList.filter(el => el.aPrice < money);
	augList = augList.sort((a, b) => b.aScore / b.aPrice - a.aScore / a.aPrice);
	//	for (let h of augList) {
	//		ns.print(h.aName, " ", h.aFaction, " ", h.aScore, " ", h.aPrice);
	//	}
	let purchased = [];
	let tryList = [];
	for (let i of augList) {
		if (money < i.aPrice) {
			continue;
		}
		if (factionCheck(ns, i.aFaction) && repCheck(ns, i.aName, i.aFaction) && boughtList.indexOf(i.aName) < 0) {
			if (purchased.length === 0) {
				tryList.push(i.aName);
			} else {
				tryList = purchased.map(function (el) { return el.aName }).concat(i.aName);
			}

			let tryCost = hAugs.getTotalAugCost(ns, tryList);
			if (tryCost < ns.getServerMoneyAvailable("home")) {
				if (i.aName !== "NeuroFlux Governor") {
					boughtList.push(i.aName)
					i.aPrice = i.aPrice * 2;
					augList.push(i)
				}
				purchased.push(i);
			}
		}
	}
	return purchased;
}

export function sellStocksForMoney(ns, goalMoney) {
	let cash = ns.getServerMoneyAvailable("home")
	if (cash > goalMoney) { return }
	let remainingReq = goalMoney - cash;
	let symbols = ns.stock.getSymbols();
	let sellOff = [];
	for (let i of symbols) {
		let pos = ns.stock.getPosition(i)
		if (pos[0] > 0) {
			let sellQty = Math.ceil(remainingReq / pos[1])
			if (sellQty > pos[0]) { sellQty = pos[0] };
			sellOff.push[i, sellQty]

			remainingReq = remainingReq - sellQty * pos[1];

			if (remainingReq <= 0) {
				break;
			}
		}
	}
	for (let j of sellOff) {
		ns.sellStock(j[0], j[1])
	}
}

export function holdOnPurchase(ns) {
	let money = ns.getServerMoneyAvailable("home") 

	if(ns.ls("home","HTTPWorm.exe").length<1 && money < 25e6) {
		return true;
	}
	if(!ns.stock.has4SDataTIXAPI() && money > 40e9*.7) {
		return true
	}
	if(!ns.corporation.hasCorporation() && money > 150e9*.7) {
		return true
	}
return false;
}

export const Purchases = [
	"PortBusters",
	"Purchased Augmentations",
	"Grafted Augmentations",
	"Stock API's and Data",
	"Corporation start up",
	"Gang Augs and Equipment"
	]
export const PortBusters = []
export const StockItems = []
export const PServers = []

export async function main(ns) {

}