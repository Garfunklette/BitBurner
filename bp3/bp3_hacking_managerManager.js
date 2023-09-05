/** @param {NS} ns */

import * as hServers from "bp3_helpers_servers.js"
import * as hMonitors from "bp3_helpers_monitors.js";
import * as hPservers from "bp3_helpers_pservers.js";

function getMaxScriptRam(ns, scriptList) {
	let maxRam = 0;
	for (let i of scriptList) {
		let sRam = ns.getScriptRam(i, "home");
		if (sRam > maxRam) {
			maxRam = sRam;
		}
	}
	return maxRam;
}

function getMaxManagedThreads(ns, target) {
	let serv = ns.getServer(target);
	let hThreads = Math.floor(ns.hackAnalyzeThreads(target, serv.moneyMax / 2))
	let secIncHack = Math.ceil(ns.hackAnalyzeSecurity(hThreads, target));
	let wThreadsHack = Math.ceil(secIncHack / ns.weakenAnalyze(1));
	let gThreads = Math.ceil(ns.growthAnalyze(target, 2));
	let wThreadsGrow = Math.ceil(ns.growthAnalyzeSecurity(gThreads, target, 1));
	return Math.max(hThreads, gThreads, wThreadsHack, wThreadsGrow);
}

function getAvailableBatchRam(ns, totalRam, runningList, scriptList) {
	for (let i of runningList) {
		totalRam = totalRam - getMaxManagedThreads(ns, i) * getMaxScriptRam(ns, scriptList);
	}
	return totalRam;
}

export async function main(ns) {
	ns.disableLog('getServerMaxMoney');
	ns.disableLog('getServerMaxRam');
	ns.disableLog('scan');
	ns.disableLog('getServerMoneyAvailable');
	let hackScripts = ["bp3_hack.js", "bp3_grow.js", "bp3_weaken.js"];

	while (true) {
		//root all
		ns.exec("bp3_hacking_rootAll.js", "home");
		//get network max ram (not home);
		let networkTotalRam = hServers.getNetworkRamTotal(ns);
		//get running managers
		let runningManagers = hMonitors.getRunningManagers(ns);
		//get target list, sort by score
		let targetList = hServers.targetList(ns);
		targetList.sort((a, b) => getMaxManagedThreads(ns, a) - getMaxManagedThreads(ns, b));
		let newTargetList = targetList.filter(el => runningManagers.indexOf(el) < 0)
		newTargetList = newTargetList.filter(el=> ns.getWeakenTime(el) < (60*2*1000));
		//determine if we can run another one on available space
		let availableBatchRam = getAvailableBatchRam(ns, networkTotalRam, runningManagers, hackScripts);
		for (let i of newTargetList) {
			let managerRam = getMaxManagedThreads(ns, i) * getMaxScriptRam(ns, hackScripts)
			if (managerRam < availableBatchRam) {
				if (ns.exec("bp3_hacking_manager.js", "home", 1, i)) {
					availableBatchRam = availableBatchRam - managerRam;
				}
			} else {
				//is there space for a new purchased server?
				if (hPservers.pserverSlotAvailableCheck(ns) === false) {
					hPservers.deleteSmallestServer(ns);
				}
				if (hPservers.pserverSlotAvailableCheck(ns)) {
					let serverSize = hPservers.serverSizer(ns, managerRam);
					let affordable = hPservers.maxAffordable(ns, ns.getServerMoneyAvailable("home"));
					serverSize = Math.max(serverSize, affordable);
					
					if (ns.getPurchasedServerCost(serverSize) < ns.getServerMoneyAvailable("home")) {
						ns.tprint(ns.purchaseServer("pserv" + serverSize, serverSize))
						if (ns.exec("bp3_hacking_manager.js", "home", 1, i)) {
							availableBatchRam = availableBatchRam - managerRam;
						}
					}
				}
			}
		}


		//can we afford a new purchased server?
		//spin up another one?

		await ns.sleep(60000);
	}
}