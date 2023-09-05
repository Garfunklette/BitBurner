/** @param {NS} ns */

import * as hServers from "bp3_helpers_servers.js"
import * as hHacking from "bp3_helpers_hacking.js"

export async function main(ns) {

	let target = "joesguns"
	//get free ram

	while (true) {
		let hostlist = hServers.getAvailableHostServers(ns, true, 4, true);
		//distribute all weakens
		let wTime = ns.getWeakenTime(target);
		let maxRam = hServers.getNetworkRamAvailable(ns, true)
		let maxThreads = Math.floor(maxRam / ns.getScriptRam("bp3_weaken.js"));
		if (maxThreads > 0)
			hHacking.distributeThreads(ns, "bp3_weaken.js", hostlist, maxThreads, target, "w", "x", wTime);
		//wait for weakens
		//do it again
		await ns.sleep(wTime);
	}
}