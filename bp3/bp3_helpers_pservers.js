/** @param {NS} ns */

export function maxAffordable(ns, money) {
	for (let i = ns.getPurchasedServerMaxRam(); i > 4; i = i / 2) {
		if (ns.getPurchasedServerCost(i) < money) {
			return i;
		}
	}
}

export function pserverSlotAvailableCheck(ns) {
	let pservers = ns.getPurchasedServers();
	if (ns.getPurchasedServerLimit() === pservers.length) {
		ns.print("pServer slots full")
		return false;
	}
	return true;
}

export function serverSizer(ns, ramRequirement) {
	for (let i = 4; i <= ns.getPurchasedServerMaxRam(); i = i * 2) {
		if (i > ramRequirement) {
			return i;
		}
	}
}

export function getSmallestServers(ns) {
	let pServers = ns.getPurchasedServers();
	pServers.sort((a, b) => ns.getServerMaxRam(a) - ns.getServerMaxRam(b));
	let smallestRam = ns.getServerMaxRam(pServers[0]);
	let smallestServers = pServers.filter(el => ns.getServerMaxRam(el) === smallestRam);
	return smallestServers;
}

export async function deleteSmallestServer(ns) {
	let sList = getSmallestServers(ns);
	if (sList.length > 0) {
		let free = sList.filter(el => ns.getServerUsedRam(el) === 0);
		if (free.length === 0) {
			await ns.scp("bp3_doNotUse.js", sList[0])
		} else {
			if (maxAffordable(ns, ns.getServerMoneyAvailable("home")) > ns.getServerMaxRam(free[0])) {
				ns.deleteServer(free[0]);
				ns.tprint("deleted pserver " + free[0])
			}
		}
	}
}

export async function getPServer(ns, ramReq) {
	if (pserverSlotAvailableCheck(ns) === false) {
	await	deleteSmallestServer(ns);
	}
	if (pserverSlotAvailableCheck(ns)) {
		let serverSize = serverSizer(ns, ramReq);
		let affordable = maxAffordable(ns, ns.getServerMoneyAvailable("home"));
		serverSize = Math.max(serverSize, affordable);

		if (ns.getPurchasedServerCost(serverSize) < ns.getServerMoneyAvailable("home") && pserverSlotAvailableCheck(ns)) {
			ns.tprint(ns.purchaseServer("pServ" + serverSize, serverSize), "spent " + ns.formatNumber(ns.getPurchasedServerCost(serverSize), "0.00a"))
			return true;
		} else {
			ns.print("Could not afford " + serverSize + "gb pserver")
			return false;
		}

	}
}

export function pserverList(ns) {
	let pServers = ns.getPurchasedServers()
	for (let i of pServers) {
		ns.print(i, " ", ns.getServerMaxRam(i));
	}
}


export async function main(ns) {
	pserverList(ns)
}