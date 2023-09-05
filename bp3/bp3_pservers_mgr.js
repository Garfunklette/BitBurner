/** @param {NS} ns */

import * as hServers from "bp3_helpers_servers.js"
import * as hPServers from "bp3_helpers_pservers.js"
import { holdOnPurchase } from "bp3_helpers_purchase.js"

function serverRamList(ns) {
	let net = hServers.networkScan(ns);
	let serverSizes = []
	let maxPossible = Math.max(ns.getServerMaxRam("home"), ns.getPurchasedServerMaxRam() * 2)
	for (let i = 2; i < maxPossible * 2; i = i * 2) {
		serverSizes.push({ sSize: i, sNum: 0, sDNU: "" })
	}

	for (let i of net) {
		let ram = ns.getServerMaxRam(i)
		if (ram > 0) {
			serverSizes[serverSizes.map(function (el) { return el.sSize }).indexOf(ram)].sNum++
		}
		if (ns.ls(i, "bp3_doNotUse.js").length > 0 && i !== "home") {
			serverSizes[serverSizes.map(function (el) { return el.sSize }).indexOf(ram)].sDNU = "DNU";
		}
	}
	return serverSizes;
}

export async function main(ns) {
	ns.disableLog('ALL');
	let counter = 0;
	while (true) {

		let availableRam = hServers.getNetworkRamAvailable(ns, false);
		let maxRam = hServers.getNetworkRamTotal(ns, false)
		let ramPerc = availableRam / maxRam;
		ns.print("(counter (" + counter + "/30))")
		ns.print("freeRam / total ram (% free)")
		ns.print(ns.formatNumber(availableRam, "0.00a") + " / " + ns.formatNumber(maxRam, "0.00a") + "(" + ns.nFormat(ramPerc, "0.00%") + ")");

		if (counter > 30) {

			if (ramPerc < .5) {
				ns.exec("bp3_progress_tor.js", "home");
				ns.exec("bp3_hacking_rootAll.js", "home");
				if (!holdOnPurchase(ns)) {
					if (await hPServers.getPServer(ns, 16))
						counter = 0;
				} else {
					ns.print("Holding on purchase")
				}
			}

		}
		let pservers = ns.getPurchasedServers();
		ns.print("# Purchased Servers " + pservers.length," / "+ns.getPurchasedServerLimit())
		let serverSizes = serverRamList(ns);

		for (let i of serverSizes) {
			if (i.sNum > 0)
				ns.print(i.sNum + " servers at " + i.sSize + "gb " + i.sDNU);
		}
		counter++;
		await ns.sleep(10000)
		ns.clearLog();
	}
}