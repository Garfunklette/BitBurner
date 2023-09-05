/** @param {NS} ns */

import * as hServers from "bp3_helpers_servers.js";
import * as dServers from "bp3_data_servers.js"
import * as dStocks from "bp3_data_stocks.js"

export function getRunningManagers(ns, script = "bp3_hacking_manager.js") {
	let net = hServers.networkScan(ns)
	let runningManagers = [];
	for (let i of net) {
		for (let j of net) {
			if (ns.isRunning(script, i, j))
				runningManagers.push(j);
		}
	}
	return runningManagers;
}

export function getMaxThreads(ns, hostServer, script, scriptHost) {
	//	ns.print("getMaxThreads: " + hostServer)
	let maxRam = ns.getServerMaxRam(hostServer);
	let scriptRam = ns.getScriptRam(script, scriptHost);
	let maxThreads = Math.floor(maxRam / scriptRam);
	return maxThreads;
}


//================Move to stock helpers ================
function getStockOpt(ns, server, action) {
	//ns.print("Has 4s datatixAPI?" +ns.TIX.has4SDataTIXAPI())
		if (ns.stock.has4SDataTIXAPI()) {
	let sym = getSymByServer(ns,server);
	if (typeof sym !== 'undefined') {
	let pos = ns.stock.getPosition(sym);
	let forecast = ns.stock.getForecast(sym);
	if ((action === "g" && pos[0]===0) || forecast > .5) {
			return false;
	}
	if ((action === "h" && pos[2]===0) || forecast < .5) {
			return false;
	}
		}
	}
	return true;
}

function getServerBySym(ns, sym) {
	let org = getKeyByValue(dStocks.StockSymbol, sym);
	let serverData = dServers.ServerMetadata.find(el => el.organizationName === org);
	return serverData.hostname;
}

function getSymByServer(ns, server) {
	let serverData = dServers.ServerMetadata.find(el => el.hostname === server);
	let org = serverData.organizationName;
	let sym = dStocks.StockSymbol[org];
	return sym;
}

function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}
//================= / move to stock helpers =======================

export function distributeThreads(ns, script, hostList, totalThreads, target, action, batch, endTime) {
	hostList.sort((a, b) => hServers.getServerFreeRam(ns, b) - hServers.getServerFreeRam(ns, a));
	//ns.print("hostList pre check "+hostList)
	if (hostList.indexOf("home" > -1)) {
		hostList.splice(hostList.indexOf("home"), 1);
		hostList.push("home");
	}
	//ns.print("hostList "+hostList)
	let remainingThreads = Math.ceil(totalThreads);
	let stockOpt = getStockOpt(ns,target, action);
	for (let k of hostList) {
		if (remainingThreads > 0) {
			let hostMaxThreads = getMaxThreads(ns, k, script, k);
			let hostThreads = Math.min(hostMaxThreads, remainingThreads);
			//	ns.print(k + " " + hostThreads + " " + target)
			//     ns.print(target, action, batch);
			let prevDup = false;
			if (batch === "prep") {
				prevDup = true;
			}
			if (ns.exec(script, k, { threads: hostThreads, preventDuplicates: prevDup }, target, stockOpt, action, batch, endTime)) {
				remainingThreads = remainingThreads - hostThreads;
			}
		}
	}
	return remainingThreads;
}

export function getMaxBatchThreads(ns, target) {
	let serv = ns.getServer(target);
	let hThreads = Math.floor(ns.hackAnalyzeThreads(target, serv.moneyMax / 2))
	let secIncHack = Math.ceil(ns.hackAnalyzeSecurity(hThreads, target));
	let wThreadsHack = Math.ceil(secIncHack / ns.weakenAnalyze(1) * 1.2);
	let gThreads = Math.ceil(ns.growthAnalyze(target, 2) * 2);
	let wThreadsGrow = Math.ceil(ns.growthAnalyzeSecurity(gThreads, target, 1) * 1.2);
	return [hThreads + wThreadsHack + gThreads + wThreadsGrow, minSec(ns, target), maxMoney(ns, target)];
}

export async function scpHackingScripts(ns, destinationList, scriptList = ["bp3_hack.js", "bp3_weaken.js", "bp3_grow.js"]) {
	let scripts = scriptList
	let scriptHost = "home";
	for (let i of destinationList) {
		let destination = i;
		await ns.scp(scripts, destination, scriptHost);
	}
}

export function getWeakenThreads(ns, target) {
	return Math.ceil(secDecreaseRequired(ns, target) / ns.weakenAnalyze(1) * 1.2);

}

export function getMaxGrowthPercent(ns, target) {
	return ns.getServerMaxMoney(target) / (ns.getServerMoneyAvailable(target) + .00001);
}

export function getGrowThreads(ns, target, growthPercent) {
	return Math.ceil(ns.growthAnalyze(target, growthPercent) * 2);
}

export function getHackThreads(ns, target, moneyGoal) {
	let threads = ns.hackAnalyzeThreads(target, moneyGoal);
	ns.print("hacking threads for money goal: " + threads + " for " + ns.nFormat(moneyGoal, "0.00a"));
	return threads;
}

export function minSec(ns, target) {
	if (ns.getServerSecurityLevel(target) <= ns.getServerMinSecurityLevel(target) * 1.05) {
		return true;
	}
	return false;
}

export function maxMoney(ns, target) {
	if (ns.getServerMoneyAvailable(target) === ns.getServerMaxMoney(target)) {
		return true;
	}
	return false;
}

export function secDecreaseRequired(ns, target) {
	return ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
}

export function hackableMoney(ns, target) {
	let avail = ns.getServerMoneyAvailable(target);
	let moneyThresh = ns.getServerMaxMoney(target) / 2;
	return avail - moneyThresh;
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

export function getHackScripts(eventList) {
	let scriptList = [];
	for (let i of eventList) {
		scriptList.push(EVENT_LIST[EVENT_LIST.map(function (el) { return el.action }).indexOf(i)].script);
	}
	return scriptList;
}

export function scheduleEvents(ns, target, eventList = ["h", "w1", "g", "w2"], batchName, batchStart, goalBatchEndTime) {
	let events = [];
	for (let i of eventList) {
		events.push({
			nTarget: target,
			n: i, nScript: "",
			nStart: 0,
			nDur: 0,
			nEnd: 0,
			nThreads: 0,
			nBName: batchName,
			nBStart: batchStart,
			nBEnd: 0,
			nGoalBatchEndTime: goalBatchEndTime,
			nStartTime: 0,
			nEndTime: 0,
			nBEndTime: 0
		})
	}
	events = updateScripts(events, getHackScripts(eventList));
	events = updateTimes(ns, events, target, goalBatchEndTime);
	events = updateThreads(ns, events, target);
	//  ns.print("sorting end times "+target);
	events.sort((a, b) => a.nEnd - b.nEnd);
	// ns.print(events);

	// ns.print("sorting start times "+target);
	events.sort((a, b) => a.nStart - b.nStart);
	// ns.print(events);
	return events;
}

export function getActionList(ns, target) {
	let actionList = [];
	if (ns.getServerMoneyAvailable(target) === ns.getServerMaxMoney(target)) {
		actionList.push("h");
	}
	actionList.push("w1");
	if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
		actionList.push("g", "w2");
	}
}

export function updateScripts(events, eventScripts = ["bp3_hack.js", "bp3_weaken.js", "bp3_grow.js", "bp3_weaken.js"]) {
	for (let i in events) {
		events[i].nScript = eventScripts[i];
	}
	return events
}

export function getActionTimes(ns, target, events) {
	let actionTimes = [];
	let actionList = events.map(function (el) { return el.n })
	for (let action of actionList) {
		switch (action) {
			case "h":
				actionTimes.push(ns.getHackTime(target));
				break;
			case "w1":
				actionTimes.push(ns.getWeakenTime(target));
				break;
			case "g":
				actionTimes.push(ns.getGrowTime(target));
				break;
			case "w2":
				actionTimes.push(ns.getWeakenTime(target));
				break;
		}
	}
	return actionTimes
}

export function updateTimes(ns, events, target, goalBatchEndTime) {
	let eventTimes = getActionTimes(ns, target, events);
	for (let i in events) {
		events[i].nDur = eventTimes[i];
	}
	let maxDur = Math.ceil(Math.max.apply(Math, events.map(function (el) { return el.nDur })) + DRUM_TIME);

	for (let i in events) {
		events[i].nBEndTime = (Math.max(goalBatchEndTime, Date.now() + maxDur))
		events[i].nEnd = maxDur - (events.length - i) * DRUM_TIME;
		events[i].nStart = events[i].nEnd - events[i].nDur;
		events[i].nEndTime = Math.ceil(events[i].nBEndTime) - (events.length - i) * DRUM_TIME;
		events[i].nStartTime = Math.floor(events[i].nEndTime - events[i].nDur);
		events[i].nBEnd = maxDur;
	}
	ns.print("batchSched")
	for (let j of events) {
		ns.print(j.nTarget, " ", j.nBName, " ", j.n, " ", j.nStartTime, " ", j.nStartTime + j.nDur, " ", j.nEndTime)
	}
	return events;
}

export function updateThreads(ns, events, target, scriptList = ["bp3_hack.js", "bp3_weaken.js", "bp3_grow.js"]) {
	let availThreads = Math.floor(hServers.getNetworkRamAvailable(ns, true) / getMaxScriptRam(ns, scriptList) * .95);
	let hThreads = 0;
	let hWThreads = 0;
	let gThreads = 0;
	let gWThreads = 0;
	let gPerc = 1.05 * ns.getServerMaxMoney(target) / ns.getServerMoneyAvailable(target)
	if (hackableMoney(ns, target) > 0) {
		hThreads = getHackThreads(ns, target, hackableMoney(ns, target));
		//       ns.print("% hacked with single thread on target: " + ns.hackAnalyze(target) + " " + target);
		hWThreads = hThreads * .002 / .05 * 1.25;
		//     ns.print("sec inc hack: " + ns.hackAnalyzeSecurity(hThreads))
		let hackedAmount = ns.hackAnalyze(target) * ns.getServerMoneyAvailable(target) * hThreads;
		gPerc = 1.05 * ns.getServerMaxMoney(target) / (ns.getServerMoneyAvailable(target) - hackedAmount)
		gThreads = getGrowThreads(ns, target, gPerc);
		//   ns.print("sec inc grow: " + ns.growthAnalyzeSecurity(gThreads))
		gWThreads = gThreads * .004 / .05 * 1.25;
		//   ns.print("weaken per thread: " + ns.weakenAnalyze(1, 1));
	} else {
		hWThreads = secDecreaseRequired(ns, target) / .05;
		if (ns.getServerMoneyAvailable(target) === 0) {
			gThreads = 1;
		} else {
			gThreads = getGrowThreads(ns, target, gPerc);
		}
		gWThreads = gThreads * .004 / .05 * 1.25;
	}
	let tThreads = hThreads + hWThreads + gThreads + gWThreads;
	let threadSet = [Math.floor(hThreads), Math.ceil(hWThreads), Math.ceil(gThreads), Math.ceil(gWThreads)]
	//   ns.print("total batch threads: " + tThreads);
	//   ns.print("network Threads Avail: " + availThreads)
	if (tThreads > availThreads) {
		let hRatio = hThreads / tThreads;
		let hWRatio = hWThreads / tThreads;
		let gRatio = gThreads / tThreads;
		let gWRatio = gWThreads / tThreads;
		threadSet = [Math.floor(availThreads * hRatio), Math.ceil(availThreads * hWRatio), Math.ceil(availThreads * gRatio), Math.ceil(availThreads * gWRatio)]
	}
	let eventThreadSet = getEventThreadSet(ns, threadSet, events);
	for (let i in events) {
		//   ns.print(events[i].n, " ", events[i].nThreads, " ", threadSet[i], " ", Math.floor(events[i].nStart), " ", Math.floor(events[i].nDur), " ", Math.floor(events[i].nEnd));
		events[i].nThreads = eventThreadSet[i];
	}
	return events;
}

export function getEventThreadSet(ns, threadSet, events) {
	let actionThreadsList = [
		{ action: "h", threads: threadSet[0] },
		{ action: "w1", threads: threadSet[1] },
		{ action: "g", threads: threadSet[2] },
		{ action: "w2", threads: threadSet[3] },
	]
	let actionThreads = [];
	let actionList = actionThreadsList.map(function (el) { return el.action })
	for (let i of events) {
		actionThreads.push(actionThreadsList[actionList.indexOf(i.n)].threads);
	}
	return actionThreads
}

export function getMaxScriptRam(ns, scriptList) {
	let maxRam = 0;
	for (let i of scriptList) {
		let sRam = ns.getScriptRam(i, "home");
		if (sRam > maxRam) {
			maxRam = sRam;
		}
	}
	return maxRam;
}

export async function launchScripts(ns, eventSchedule) {
	ns.print("Launch Start");
	eventSchedule.sort((a, b) => a.nStartTime - b.nStartTime)
	let prevTime = Date.now();
	let maxDur = Math.max.apply(Math, eventSchedule.map(function (el) { return el.nDur })) + DRUM_TIME * 4;
	let finalSleep = maxDur - eventSchedule[eventSchedule.length - 1].nEnd + DRUM_TIME;
	for (let i = 0; i < eventSchedule.length; i++) {
		//       ns.print(eventSchedule[i]);
		let target = eventSchedule[i].nTarget;
		let hostServers = hServers.getAvailableHostServers(ns, false, ns.getScriptRam(eventSchedule[i].nScript, "home"));
		if (eventSchedule.nScript === "bp3_hack.js" && (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target) / 2)) {
			let sleepTime = 0;
			if (i === 0) {
				sleepTime = eventSchedule[i].nStart;
			} else {
				sleepTime = eventSchedule[i].nStart - eventSchedule[i - 1].nStart;
			}
			ns.print("sleeping for " + sleepTime);
			await ns.sleep(sleepTime)
			//       printServerStatus(ns, target);
		} else {
			let sleepTime = 0;
			if (i === 0) {
				sleepTime = eventSchedule[i].nStart;
			} else {
				sleepTime = eventSchedule[i].nStart - eventSchedule[i - 1].nStart;
			}


			ns.print("sleeping for " + sleepTime);
			await ns.sleep(sleepTime)
			ns.print("Distributing: " + eventSchedule[i].n, " ", eventSchedule[i].nThreads, " ", Math.floor(eventSchedule[i].nStart), " ", Math.floor(eventSchedule[i].nDur), " ", Math.floor(eventSchedule[i].nEnd));
			distributeThreads(ns, eventSchedule[i].nScript, hostServers, eventSchedule[i].nThreads, target, eventSchedule[i].n, eventSchedule[i].nBName, eventSchedule[i].nEndTime)
			let currentTime = Date.now();
			let elapsedTime = currentTime - prevTime;
			ns.print(elapsedTime);
			ns.print("secDif " + (ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target)));
			prevTime = currentTime;
			//     printServerStatus(ns, target);
		}
	}
	ns.print("sleeping for " + finalSleep);
	await ns.sleep(finalSleep);
}

export function getLaunchPeriodEvents(ns, eventSchedule, periodLength) {
	let periodEvents = [];
	periodEvents = eventSchedule.filter(el => el.nStartTime < Date.now() + periodLength)
	eventSchedule = eventSchedule.filter(el2 => el2.nStartTime >= Date.now() + periodLength)
	periodEvents.sort((a, b) => a.nStartTime - b.nStartTime);
	ns.print("======")
	ns.print("Period events")
	ns.print("Target batchname action estStartTime")

	ns.print("end period events")
	ns.print("======")
	return [periodEvents, eventSchedule]
}

export async function launchPeriodEvents(ns, periodEventSchedule, periodLength, runningBatches,hNet = false) {

	ns.print("Period length " + periodLength)
	periodEventSchedule.sort((a, b) => a.nStartTime - b.nStartTime)
	for (let i = 0; i < periodEventSchedule.length; i++) {
		let target = periodEventSchedule[i].nTarget;
		let batchName = periodEventSchedule[i].nBatchName;
		let hostServers = hServers.getAvailableHostServers(ns, true, ns.getScriptRam(periodEventSchedule[i].nScript, "home"),hNet);
		//     ns.print("Distributing: " + periodEventSchedule[i].n, " ", periodEventSchedule[i].nThreads, " ", Math.floor(periodEventSchedule[i].nStart), " ", Math.floor(periodEventSchedule[i].nDur), " ", Math.floor(periodEventSchedule[i].nEnd));

		if (periodEventSchedule[i].nScript === "bp3_hack.js" && (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target) / 2)) {
		} else {
			/*	if (periodEventSchedule[i].nTarget === "n00dles") {
					ns.print(Date.now())
					ns.print(periodEventSchedule[i].nTarget, " ", periodEventSchedule[i].nBName, " ", periodEventSchedule[i].n, " ", periodEventSchedule[i].nStartTime)
					ns.print(periodEventSchedule[i].nTarget, " ", periodEventSchedule[i].nBName, " ", periodEventSchedule[i].n, " ", periodEventSchedule[i].nEndTime)
				}*/
			distributeThreads(ns, periodEventSchedule[i].nScript, hostServers, periodEventSchedule[i].nThreads, target, periodEventSchedule[i].n, periodEventSchedule[i].nBName, periodEventSchedule[i].nEndTime)
		}
		if (periodEventSchedule[i].nAction === "w2") {
			runningBatches.splice(runningBatches.find(el => (el.target === target && el.batchName === batchName)), 1)
		}
		/*	let sleepTime = 0;
			if (i > 0) {
				sleepTime = periodEventSchedule[i].nStart - periodEventSchedule[i - 1].nStart;
			}
			if (sleepTime > 0) {
				if (periodEventSchedule[i].nTarget === "n00dles") {
					ns.print("SleepTime til next event " + sleepTime)
				}
				await ns.sleep(sleepTime);
			}*/
	}
	/*let endSleep = Date.now() - now + periodLength;
	if (endSleep > 0)
		await ns.sleep(endSleep)*/
	await ns.sleep(DRUM_TIME)
	return runningBatches;
}

export function batchInEventSchedule(ns, eventSchedule) {
	let runningBatches = [];
	for (let i of eventSchedule) {
		if (!runningBatches.includes([i.nTarget, i.nBatchName])) {
			runningBatches.push[i.nTarget, i.nBatchName]
		}
	}
	return runningBatches;
}

export function batchQueueStatus(ns, queue) {
	let targetList = []
	for (let i of queue) {
		if (targetList.indexOf(i.nTarget < 0)) {
			targetList.push(i.nTarget);
		}
	}
	for (let j of targetList) {
		for (let k of queue) {
			if (k.nTarget === j) {
				targetList.push({
					target: k.nTarget,
					batches: []
				})
				if (batches.indexOf(k.nBatchName < 0)) {
					targetList.target.batches.push(k)
				}
			}
		}
	}
	//target, batch1: actions, batch2:actions, etc.
}

export function printServerStatus(ns, target) {
	ns.print(target)
	ns.print("secDif " + (ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target)));
	ns.print("money perc in dec " + ns.getServerMoneyAvailable(target) / ns.getServerMaxMoney(target));
}

export const EVENT_LIST = [{ action: "h", script: "bp3_hack.js" }, { action: "w1", script: "bp3_weaken.js" }, { action: "g", script: "bp3_grow.js" }, { action: "w2", script: "bp3_weaken.js" }]
export const DRUM_TIME = 1000;

export async function main(ns) {
	ns.tail();
	//	distributeThreads(ns, "bp3_grow.js", ["n00dles", "harakiri-sushi"], 10, "n00dles");
	ns.print(getMaxThreads(ns, "n00dles", "bp3_grow.js", "n00dles"));
}