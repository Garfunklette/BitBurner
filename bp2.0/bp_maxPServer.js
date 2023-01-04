/** @param {NS} ns */
import {canBuyCheck,getHashMoneyAvailable} from "bp_helpers_purchase.js"

function getSmallestServerSize(ns) {
let pList = ns.getPurchasedServers();
		smallestPServerRam = Math.min.apply(Math, pList.map(function (el) { return ns.getServerMaxRam(el) }));
return smallestPServerRam;
}

function maxAffordableServer(ns) {

	let money = ns.getServerMoneyAvailable("home");
	let hashMoney = getHashMoneyAvailable(ns);
	let minRam = 16;
	let pList = ns.getPurchasedServers();
	let smallestPServerRam = minRam;
	if (pList.length > 0) {
		smallestPServerRam = Math.min.apply(Math, pList.map(function (el) { return ns.getServerMaxRam(el) }));
	}
	ns.print(smallestPServerRam);
	if (smallestPServerRam > minRam) {
		minRam = smallestPServerRam;
	}
	ns.print(minRam);
	let maxRam = ns.getPurchasedServerMaxRam();
	let ram = minRam;
	for (let i = minRam; i < maxRam; i = i * 2) {
		if (ns.getPurchasedServerCost(i) < money+hashMoney) {
			ram = i;
		}
	}
	return ram;
}

function pServerLimitCheck(ns) {
	let no = ns.getPurchasedServers();
	if(no === ns.getPurchasedServerLimit()) {
		let ram = getSmallestServerSize(ns);
		ns.exec("bp_sing_destroyServers.js","home",1,ram);
	}
}

export async function main(ns) {

	let purchase = ns.args[0];
	let no = ns.args[1] || 1;
	let yprint = true;
	if (ns.args.length > 2) { yprint = ns.args[2] }
	let ram = maxAffordableServer(ns);
	if (yprint === true) {
		ns.tprint(ram);
		ns.tprint(ns.nFormat(ns.getPurchasedServerCost(ram), "0.00a"));
	}
	if (purchase === "buy") {
		pServerLimitCheck(ns);
		canBuyCheck(ns,ns.getPurchasedServerCost(ram))
		ns.purchaseServer("pServ" + ram, ram);
		if (no > 1) {
			for (let j = 0; j < no; j++) {
				ns.purchaseServer("pServ" + ram, ram);
			}
		}


	}
}
