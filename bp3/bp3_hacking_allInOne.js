/** @param {NS} ns */

import { getNetworkRamTotal, networkScan, getRootAccess, getAvailableHostServers, getTargetList, getTargetScore } from "bp3_helpers_servers.js"
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


function getAllRunningScripts(ns) {
	let net = networkScan(ns)
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

function getTotBatchNum(ns, target) {
	return Math.max(Math.floor(ns.getWeakenTime(target) / (hHacking.DRUM_TIME * 4)), 1)
}

function getAvailableBatches(ns, target, schedule) {
	let ars = getAllRunningScripts(ns)

	let totBatchNum = getTotBatchNum(ns, target)
	ns.print("target" + " total batch num " + totBatchNum)
	let availBatches = [];
	ars.filter(el => el.args.indexOf[target] > 0);
	//ns.print(ars);
	for (let h = 0; h < totBatchNum; h++) {
		availBatches.push(h);
	}
	for (let i of ars) {
		let sArgs = i.args;
		for (let j = 0; j < totBatchNum; j++) {
			//	ns.print(j, i.args, i.filename)
			//	ns.print(sArgs.indexOf(j))
			if ((sArgs[2] === j) && (sArgs[0] === target) && availBatches.indexOf(j) > -1) {
				//			ns.print("running avail batch pre splice")
				//		ns.print(availBatches)
				availBatches.splice(availBatches.indexOf(j), 1);
				j--
				//	ns.print(availBatches);
				//	ns.print("running avail batch pre splice")
			}
		}
	}
	//	ns.print("schedule")
	//	ns.print(schedule)
	for (let k of schedule) {
		for (let m = 0; m < totBatchNum; m++) {
			if (k.nTarget === target && k.nBName === m && availBatches.indexOf(m) > -1) {
				//	ns.print("sched avail batch pre splice")
				//	ns.print(availBatches)
				availBatches.splice(availBatches.indexOf(m), 1)
				m--;
				//		ns.print("sched avail batch post splice")

				//	ns.print(availBatches)
			}
		}
	}


	//	ns.print("avail batches")
	//	ns.print(target)
	//	ns.print(availBatches);
	return availBatches;
}

function getLatestScheduledBatchEndTime(ns, target, queue) {
	let tSchedule = queue.filter(el => (el.nTarget === target && el.n === "w2"));
	let latestBatchTime = 0;
	for (let i of tSchedule) {
		if (i.nEndTime > latestBatchTime) {
			latestBatchTime = i.nEndTime;
		}
	}
	return latestBatchTime;
}

function getLatestRunningBatchTime(ns, target) {
	let ars = getAllRunningScripts(ns)
	//	let availBatches = ["a", "b", "c"]
	ars.filter(el => el.args.indexOf[target] > 0);
	//ns.print(ars);
	let latestBatchTime = 0;
	if (ars.length === 0) {
		ns.print("no running batches")
		return 0;
	}
	for (let i of ars) {
		let sArgs = i.args;
		ns.print(i.args, i.filename)
		if ((sArgs.indexOf(target) > -1) && (sArgs.indexOf("w2") > -1)) {
			if (sArgs[4] > latestBatchTime) {
				latestBatchTime = sArgs[4]
			}
		}

	}
	return latestBatchTime;
}

function getLatestBatchTime(ns, target, queue) {
	ns.print("Latests scheduled batch Time")
	ns.print(getLatestScheduledBatchEndTime(ns, target, queue))
	ns.print("Latest running batch time")
	ns.print(getLatestRunningBatchTime(ns, target))
	let latestBatchTime = Math.ceil(Math.max(getLatestScheduledBatchEndTime(ns, target, queue), getLatestRunningBatchTime(ns, target)))
	ns.print("Latest batch Time")
	ns.print(latestBatchTime)
	return latestBatchTime
}

//get free ram
//determine number of threads we can run
//create target list and sort
//figure out what's already running
//choose target
//figure out thread ratio per batch
//time and distribute actions
//whwgw
//get weaken time, time should be 2 + weaken time - grow time
//get grow time

async function batchAdd(ns, target, batchName, earlyGame, queue, scheduledBatches) {
	getRootAccess(ns, target);
	hHacking.printServerStatus(ns, target);
	let threads = 0;

	if (ns.hasRootAccess(target) === true) {
		//     find available ram for those threads
		let hostServers = getAvailableHostServers(ns, earlyGame, ns.getScriptRam("bp3_weaken.js", "home"));
		//     copy the weaken script to the server(s) with RAM
		await hHacking.scpHackingScripts(ns, hostServers)
		let actionList = hHacking.getActionList(ns, target)
		let latestBatchTime = getLatestBatchTime(ns, target, queue)
		ns.print("batchAdd target latestBatchTime")
		ns.print(target, " ", latestBatchTime)
		let batchStart = 0;
		if (latestBatchTime > 2000000) { batchStart = latestBatchTime + hHacking.DRUM_TIME * 4 } else { batchStart = latestBatchTime + hHacking.DRUM_TIME * 4 - Date.now() }
		let eventSchedule = hHacking.scheduleEvents(ns, target, actionList, batchName, batchStart, latestBatchTime)
		queue = updateQueue(ns, queue, eventSchedule)
		hHacking.printServerStatus(ns, target);
		threads = getMaxManagedThreads(ns, target)
		scheduledBatches.push({ bTarget: target, bName: batchName, bThreads: threads })
	}
	return [queue, scheduledBatches, threads];
}

function updateQueue(ns, queue, addedEvents) {
	if (queue.length > 0) {
		queue = queue.concat(addedEvents);
	} else {
		queue = addedEvents
	}
	queue.sort((a, b) => a.nStart - b.nStart);
	return queue;
}

function getScheduledRam(ns, queue, hackScripts) {
	let scheduledRam = 0;
	for (let i of queue) {
		scheduledRam = scheduledRam + i.nThreads * getMaxScriptRam(ns, hackScripts);
	}
	return scheduledRam
}

//===================MAIN==================
export async function main(ns) {
	ns.disableLog('ALL')
	let hNet = ns.args[0] || false
	/*
	phase steps by 1 second
		check running batches
	  
	
	running batch list:
		when batch started, add to running batch list
		when batch complete (last weaken goes off), remove from running batch list
		queue new batches if ram available
		batch list comprised of target, batch name, estimated threads
	
	queue based on open thread ram:
		batch threads estimated based on server at weakest sec, 45% money removal
	*/

	let hackScripts = ["bp3_hack.js", "bp3_grow.js", "bp3_weaken.js"];

	let usedRam = 0;
	let scheduledBatches = []
	let queue = [];
	while (true) {
		//root all
		ns.exec("bp3_hacking_rootAll.js", "home");
		//get network max ram (not home);
		let networkTotalRam = getNetworkRamTotal(ns);

		//get running managers


		//get target list, sort by score
		let targetList = getTargetList(ns);
		targetList.sort((a, b) => getTargetScore(ns, b) - getTargetScore(ns, a));
		//determine if we can run another one on available space
		targetList = targetList.filter(el => ns.getWeakenTime(el) < 120000);
		//targetList = ["n00dles"]
		ns.print("Target list " + targetList)
		for (let i of targetList) {
			let availBatches = getAvailableBatches(ns, i, queue)
			if (availBatches.length > 0) {
				for (let j of availBatches) {

					let newBatch = await batchAdd(ns, i, j, true, queue, scheduledBatches);
					queue = newBatch[0]
					scheduledBatches = newBatch[1]
					usedRam = getScheduledRam(ns, queue, hackScripts)
					if (usedRam / networkTotalRam > 0.8) {
						break;
					}
				}
				ns.print("used ram / netTotRam " + usedRam + "/" + networkTotalRam)
				if (usedRam / networkTotalRam > 0.8) {
					break;
				}
			}
		}
		//	ns.print("main queue")
		//	ns.print(queue)
		ns.print("Now: " + Date.now())
		let e = await hHacking.getLaunchPeriodEvents(ns, queue, hHacking.DRUM_TIME)
		let periodEvents = e[0]


		queue = e[1]
		if (periodEvents.length === 0) {
			await ns.sleep(hHacking.DRUM_TIME)
			ns.print("queue empty")
		} else {
			//			ns.print("launching period events")
			//			ns.print(Date.now());
			//			ns.print("Remaining queue")
			//			ns.print(queue.length)


			queue.sort((a, b) => a.nEndTime - b.nEndTime)
			queue.sort((a, b) => a.nTarget - b.nTarget)
			/*		for (let i of queue) {
						ns.print(i.nTarget, " ", i.nBName, " ", i.n, " ", i.nEndTime)
					}
					ns.print("Period Events")
					ns.print(periodEvents.length)
					*/
			periodEvents.sort((a, b) => a.nEndTime - b.nEndTime)
			periodEvents.sort((a, b) => a.nTarget - b.nTarget)
			/*		for (let j of periodEvents) {
						ns.print(j.nTarget, " ", j.nBName, " ", j.n, " ", j.nEndTime)
					}*/

			//ns.print(periodEvents)

			await hHacking.launchPeriodEvents(ns, periodEvents, hHacking.DRUM_TIME,hNet)
		}
		ns.clearLog();
		//	await ns.sleep(hHacking.DRUM_TIME)
	}
}