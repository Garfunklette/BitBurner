/** @param {NS} ns */
import * as hPservers from "bp3_helpers_pservers.js";

export async function main(ns) {
	let ram = ns.args[0];
	if (ram = "max") {
		ram = hPservers.maxAffordable(ns, ns.getServerMoneyAvailable("home"));
	}
	let noServs = ns.args[1];
	for (let i = 0; i < noServs; i++) {
		if (hPservers.pserverSlotAvailableCheck(ns) === false) {
			hPservers.deleteSmallestServer(ns);
		}
		ns.tprint(ns.purchaseServer("pServ" + ram, ram))
	}

	ns.print(hPservers.maxAffordable(ns, ns.getServerMoneyAvailable("home")))
}