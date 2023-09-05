/** @param {NS} ns */

function minSec(ns, target) {
	if (ns.getServerSecurityLevel(target) <= ns.getServerMinSecurityLevel(target) * 1.05) {
		return true;
	}
	return false;
}

function hackableMoney(ns, target) {
	let avail = ns.getServerMoneyAvailable(target);
	let moneyThresh = ns.getServerMaxMoney(target) / 2;
	return avail - moneyThresh;
}

export async function main(ns) {
	let target = ns.args[0];
	if(ns.hasRootAccess(target)) {
	while (true) {
		if (minSec(ns, target) === false) {
			await ns.weaken(target);
		} else {
			if (hackableMoney(ns, target) > 0) {
				await ns.hack(target);
			} else {
				await ns.grow(target);
			}
		}
		await ns.sleep(100);
	}
	}
}