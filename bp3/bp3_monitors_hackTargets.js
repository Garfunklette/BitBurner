/** @param {NS} ns */

import * as hServers from "bp3_helpers_servers.js";
import * as hMonitors from "bp3_helpers_monitors.js";
import * as hHacking from "bp3_helpers_hacking.js";




export async function main(ns) {
	ns.disableLog("ALL");
	ns.tail();
	let netFreeRam = Math.floor(hServers.getNetworkRamAvailable(ns, false))
	let netMaxRam = Math.floor(hServers.getNetworkRamTotal(ns, false))
	while (true) {
		netFreeRam = Math.floor(hServers.getNetworkRamAvailable(ns, false))
		netMaxRam = Math.floor(hServers.getNetworkRamTotal(ns, false))


		ns.print("Network Ram (Free / Total): " + netFreeRam + " " + netMaxRam + " " + ns.formatPercent(netFreeRam / netMaxRam, 1));
		//		let runningManagers = hHacking.getRunningManagers(ns,"bp3_hacking_manager.js");
		//		let runningBatches = hHacking.getRunningManagers(ns,"bp3_hacking_batch.js");
		//		let runningMonitors = runningManagers
		//		for(let k of runningBatches) {
		//			if(runningMonitors.indexOf(k) <0) {
		//				runningMonitors.push(k);
		//			}
		//		}
		let runningMonitors = hServers.getTargetList(ns);
		runningMonitors = runningMonitors.filter(el => ns.getWeakenTime(el) < 3600 / 4 * 1000);
		runningMonitors.sort((a, b) => hServers.getTargetScore(ns, b) - hServers.getTargetScore(ns, a));
		ns.print("target money (%) secLvl (+) weakenTime batchThreads batches actions");

		for (let k=0;k<10;k++) {
		let	i = runningMonitors[k]
			let j = hMonitors.hackTargetInfo(ns, i)
			//if (Number(j.sMoneyPerc) > 0.4) {
				ns.print(hMonitors.buffer(i, runningMonitors) + j.sName + " " + j.sMoney + " " + j.sMoneyPerc + " " + j.sSec + " " + "(+" + j.sSecPlus + ")" + " " + j.sWeakenTime + " " + j.sBatchThreads + " " + j.sMgrs + " " + j.sActions);
			//}
		}
		await ns.sleep(500);
		ns.clearLog();
	}
}