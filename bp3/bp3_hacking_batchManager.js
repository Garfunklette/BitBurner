/** @param {NS} ns */
/** @param {NS} ns */

import * as hServers from "bp3_helpers_servers.js"
import * as hMonitors from "bp3_helpers_monitors.js";
import * as hHacking from "bp3_helpers_hacking.js";

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
	return hThreads + gThreads + wThreadsHack + wThreadsGrow;
}

function getAvailableBatchRam(ns, totalRam, runningList, scriptList) {
	for (let i of runningList) {
		totalRam = totalRam - getMaxManagedThreads(ns, i) * getMaxScriptRam(ns, scriptList);
	}
	return totalRam;
}

function scriptChoice(ns, target) {
	let choice = "bp3_hacking_batch.js"
	if (hHacking.minSec(ns, target) === false || hHacking.maxMoney(ns, target) === false) {
		choice = "bp3_hacking_prepBatch.js"
	}
	return choice;
}

function getAllRunningScripts(ns) {
	let net = hServers.networkScan(ns)
	let runningScripts = [];
	for (let i of net) {
		let sRunningScripts = ns.ps(i);
		for (let j of sRunningScripts) {
			let rScriptNames = runningScripts.map(function (el) { return el.filename })
			let rScriptArgs = runningScripts.map(function (el) { return JSON.stringify(el.args) })
			if (rScriptNames.indexOf(j.filename) < 0 && rScriptArgs.indexOf(JSON.stringify(j.args)) < 0) {
				runningScripts.push(j);
			}
		}
	}
	return runningScripts;
}

function getEstimatedEndTime(ns, target, startTime) {
	return Math.ceil( hHacking.DRUM_TIME * 5 + startTime);
}

function getAvailableBatches(ns, target) {
	let ars = getAllRunningScripts(ns)
	let wTime = ns.getWeakenTime(target);
	let totNumBatches = Math.max(Math.floor(wTime / (hHacking.DRUM_TIME * 4 )), 1)

	let availBatches = ["a", "b", "c", "d", "e", "f", "g", "h", "i"]
	availBatches = availBatches.slice(0, totNumBatches)
	ars.filter(el => el.args.indexOf[target] > 0);
	//ns.print(ars);
	for (let i of ars) {
		let sArgs = i.args;
		for (let j in availBatches) {
			//	ns.print(j,i.args,i.filename)
			if ((sArgs.indexOf(availBatches[j]) > -1) && (sArgs.indexOf(target) > -1) && (i.filename === "bp3_hacking_batch.js")) {
				availBatches.splice(availBatches.indexOf(availBatches[j]), 1);
				j--;
			}
		}
	}
	ns.print(target," ",availBatches)
	return availBatches;
}

function getLatestBatchTime(ns, target) {
	ns.print("Starting getLatest Batch " + target)
	let ars = getAllRunningScripts(ns)
	let wTime = ns.getWeakenTime(target);
	let totNumBatches = Math.max(Math.floor(wTime / (hHacking.DRUM_TIME * 4 )), 1)
	ns.print("tot num batches " + totNumBatches)
	let availBatches = ["a", "b", "c", "d", "e", "f", "g", "h", "i"]
	availBatches = availBatches.slice(0, totNumBatches)
	ns.print("avail batches " + availBatches)
	ars.filter(el => el.args.indexOf[target] > 0);
	//ns.print(ars);
	let latestBatchTime = 0;
	for (let i of ars) {
		let sArgs = i.args;
		for (let j in availBatches) {
			//	ns.print(j,i.args,i.filename)
			if ((sArgs.indexOf(target) > -1) && (i.filename === "bp3_hacking_batch.js")) {
				if (sArgs[3] > latestBatchTime) {
					latestBatchTime = sArgs[3]
				}
			}
		}
	}
	//ns.print(latestBatchTime);
	return latestBatchTime;
}

function updateRunningBatches(ns, runningBatchesList, addBatch, removeBatch) {
	if (removeBatch.length > 0) {
		if (runningBatchesList.includes(removeBatch)) {
			runningBatchesList.splice(runningBatchesList.indexOf(removeBatch), 1)
		}
	}
	if (addBatch.length > 0) {
		if (!runningBatchesList.includes(addBatch)) {
			runningBatchesList.push
		}
	}
	return runningBatchesList;
}

async function hostsPrep(ns, target) {
	let hostServers = hServers.getAvailableHostServers(ns, earlyGame, ns.getScriptRam("bp3_weaken.js", "home"));
	hServers.getRootAccess(ns, target);
	await hHacking.scpHackingScripts(ns, hostServers)
}

async function runBatch(ns, target, batchName, waitTime = 0, earlyGame = false) {

	hServers.getRootAccess(ns, target);
	hHacking.printServerStatus(ns, target);

	await ns.sleep(waitTime);

	if (ns.hasRootAccess(target) === true) {
		//     find available ram for those threads
		let hostServers = hServers.getAvailableHostServers(ns, earlyGame, ns.getScriptRam("bp3_weaken.js", "home"));
		//     copy the weaken script to the server(s) with RAM
		await hHacking.scpHackingScripts(ns, hostServers)
		ns.print(batchName);
		let actionList = hHacking.getActionList(ns, target)
		let eventSchedule = hHacking.scheduleEvents(ns, target, actionList, batchName)

		await hHacking.launchScripts(ns, eventSchedule, target);

		hHacking.printServerStatus(ns, target);

	}
}

function aggregateBatchSchedule(ns, eventSchedule, target, batchName, waitTime) {
	let actionList = hHacking.getActionList(ns, target)
	let nextBatch = hHacking.scheduleEvents(ns, target, actionList, batchName, waitTime)
	eventSchedule = eventSchedule.concat(nextBatch)
	eventSchedule.sort((a, b) => a.nStart - b.nStart)
	return eventSchedule;
}



export async function main(ns) {
	ns.disableLog('ALL')
	let hackScripts = ["bp3_hack.js", "bp3_grow.js", "bp3_weaken.js"];
	//start loop
	//get free ram
	//determine number of threads we can run
	//create target list of prepped servers and sort
	//figure out what's already running
	//choose target

	//figure out thread ratio per batch
	//time and distribute actions
	//create target list of prepable servers and sort
	//figure out what's already running
	//choose target
	//figure out thread ratio per batch
	//time and distribute actions
	//end loop

	let timeHorizon = 2 * 60 * 1000

	let longestBatchTime = timeHorizon
	let runningBatches = [];
	while (true) {
		if (ns.getServerMoneyAvailable("home") > 28e9) {
			timeHorizon = 10 * 60 * 1000;
		} else {
			timeHorizon = 2 * 60 * 1000;
		}

		//root all
		ns.exec("bp3_hacking_rootAll.js", "home");
		//get network max ram (not home);
		let networkTotalRam = hServers.getNetworkRamTotal(ns);
		//get running managers
		let runningManagers = hMonitors.getRunningManagers(ns, "bp3_hacking_batch.js");
		let runningPrepManagers = hMonitors.getRunningManagers(ns, "bp3_hacking_prepBatch.js");
		//	if (runningPrepManagers.length < 1) {
		for (let h of runningPrepManagers) {
			if (runningManagers.indexOf(h) < 0) {
				runningManagers.push(h)
			}
		}
		//get target list, sort by score
		let targetList = hServers.targetList(ns);
		targetList.sort((a, b) => hServers.targetScore(ns, b) - hServers.targetScore(ns, a));
		let newTargetList = targetList.filter(el => runningManagers.indexOf(el) < 0)
		newTargetList = newTargetList.filter(el => ns.getWeakenTime(el) < (timeHorizon));
		//determine if we can run another one on available space
		let availableBatchRam = getAvailableBatchRam(ns, networkTotalRam, runningManagers, hackScripts);

		longestBatchTime = getEstimatedEndTime(ns, newTargetList[0], 0)

		for (let i of newTargetList) {
			//ram check
			runningPrepManagers = hMonitors.getRunningManagers(ns, "bp3_hacking_prepBatch.js");

			let script = scriptChoice(ns, i)
			if (runningPrepManagers.length > 0 && script === "bp3_hacking_prepBatch.js") {
				continue;
			}
			let managerRam = getMaxManagedThreads(ns, i) * getMaxScriptRam(ns, hackScripts)


			let availBatches = getAvailableBatches(ns, i);

			if (runningPrepManagers.length === 0 && script === "bp3_hacking_prepBatch.js") {
				availBatches = ["prep"];
			}

			//let availBatches = ["a","b"]
			let waitTime = getEstimatedEndTime(ns, i, 0)

			if (availBatches.length > 0) {
				for (let j in availBatches) {
					//let j = 0;
					let batName = availBatches[j]
					//	if (managerRam < availableBatchRam) {
					if (script === "bp3_hacking_prepBatch.js") { batName = "prep" };
					if (ns.exec(script, "home", { preventDuplicate: true }, i, batName, getLatestBatchTime(ns, i) + hHacking.DRUM_TIME*4*j)) {
						availableBatchRam = availableBatchRam - managerRam;
					}
					/*} else {
							//is there space for a new purchased server?
	
							if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(4))
								hPservers.getPServer(ns, managerRam)
							if (ns.exec(script, "home", 1, i, batName, getLatestBatchTime(ns, i) + ns.getWeakenTime(i) * j)) {
								availableBatchRam = availableBatchRam - managerRam;
							}
						}*/
				}
				availBatches = getAvailableBatches(ns, i);
			}
			if (getEstimatedEndTime(ns, i, 0) > longestBatchTime) {
				longestBatchTime = getEstimatedEndTime(ns, i, 0)
			}

		}
		ns.print("Time horizon " + timeHorizon / 60000 + " min weakenTime")
		ns.print("New target list; weaken time; max mgd threads")
		for (let i of newTargetList)
			ns.print(i, " ", +Math.floor(ns.getWeakenTime(i), 1), " ", getMaxManagedThreads(ns, i));

		//	}
		//can we afford a new purchased server?
		//spin up another one?
		await ns.sleep(1000);
		ns.clearLog();
	}
}