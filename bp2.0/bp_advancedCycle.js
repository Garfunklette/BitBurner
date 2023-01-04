import * as sn from "bp_scanNetwork.js";

/** @param {NS} ns **/
//advancedCycle utilizes all available free space
//and if possible do 3 full batches.

function getServerFreeRam(ns, target) {
	let freeRam = ns.getServerMaxRam(target) - ns.getServerUsedRam(target);
	return freeRam;
}

function aFormat(ns, input) {
	let output = ns.nFormat(input, "0.00a");
	return output;
}

function getAction(ns, target) {
	let sma = ns.getServerMoneyAvailable(target);
	let smm = ns.getServerMaxMoney(target);
	let ssl = ns.getServerSecurityLevel(target);
	let smsl = ns.getServerMinSecurityLevel(target);

	let action = "weaken";

	if (ssl > smsl * 1.05) {
		action = "weaken";
	} else {
		if (sma < smm * 0.9) {
			action = "grow";
		} else {
			action = "hack";
		}
	}
	return action;
}

function getActionsTimes(ns, target) {
	let actionsTimes = { targ: "", hackT: 0, growT: 0, weakenT: 0 };
	actionsTimes.hackT = ns.getHackTime(target);
	actionsTimes.growT = ns.getGrowTime(target);
	actionsTimes.weakenT = ns.getWeakenTime(target);
	actionsTimes.targ = target;
	return actionsTimes;
}

function getActionThreads(ns, target, action) {
	let sma = ns.getServerMoneyAvailable(target);
	let smm = ns.getServerMaxMoney(target);
	if (sma === 0) { sma = 1 }

	let threads = 1;

	if (action === "weaken") {
		let ssl = ns.getServerSecurityLevel(target);
		let smsl = ns.getServerMinSecurityLevel(target);
		threads = (ssl - smsl) / .05;
		
	}
	if (action === "grow") {
		let ratio = smm / sma;
		threads = ns.growthAnalyze(target, ratio);
		ns.print("ratio "+ratio)
		ns.print("threads " +threads)
	}
	if (action === "hack") {
		let hp = ns.hackAnalyze(target); //percent of current money that a hack would take
		ns.print("hp: " + hp + ", sma: " + aFormat(ns, sma) + ", smm" + aFormat(ns, smm));
		threads = (sma - smm / 2) / (sma * hp);  // amount of money we want to hack
		ns.print(threads);
	}
	ns.print(Math.ceil(threads));
	return Math.ceil(threads);
}

function getHostMaxThreads(ns, hostServer, script, scriptHostServer) {
	let freeRam = getServerFreeRam(ns, hostServer);
	let scriptRam = ns.getScriptRam(script, scriptHostServer);
	let mThreads = Math.floor(freeRam / scriptRam);
	return mThreads;
}

async function batchThreadReqs(ns, target) {
	let btr = { batch: -1, status: false, hThr: -1, whThr: -1, gThr: -1, wgThr: -1 };
	if (ns.getWeakenTime(target) < 300000) {
			await prepServer(ns, target);
		btr.status = true;
	} else {
		ns.print("too long to prep");
	}
	let ma = ns.getServerMoneyAvailable(target);
	if (ma === 0) {	ma = 1};
	let mm = ns.getServerMaxMoney(target);
	let ha = ns.hackAnalyze(target);
	btr.hThr = mm / 1.9 / (ha * ma);
	btr.whThr = btr.hThr * .002 / .05;
	btr.gThr = ns.growthAnalyze(target, mm / 2.1);
	ns.print(mm)
	ns.print(ma)
	ns.print(btr.gThr)
	btr.wgThr = btr.gThr * .004 / .05;
	btr.batch = btr.hThr + btr.whThr + btr.gThr + btr.wgThr;
	return btr;
}

function getTotalFreeRam(ns) {
	let hosts = sn.scanNetwork(ns)
	if (!(ns.args[1] === "home")) {
		hosts.splice(hosts.indexOf("home"), 1);
	}
	hosts = hosts.filter(el => ns.hasRootAccess(el));
	hosts = hosts.sort((a, b) => ns.getServerMaxRam(b) - ns.getServerMaxRam(a));
	let totalFreeRam = 0;
	for (let i in hosts) {
		totalFreeRam = getServerFreeRam(ns, hosts[i]) + totalFreeRam;
	}
	return totalFreeRam;
}

async function prepServer(ns, target) {
	
	let action = getAction(ns, target);
	let threads = 1;
	while (action !== "hack") {
		let script = action + ".js";
		threads = Math.min(getActionThreads(ns, target, action));
		if (threads > 0) {
		await distributeThreads(ns,action,threads,target,"prep");
		}
		let sleepTime = ns.getWeakenTime(target);
		await ns.sleep(sleepTime);
		action = getAction(ns, target);
	}
	let prepped = { ms: ns.getServerMinSecurityLevel(target), ss: ns.getServerSecurityLevel(target), mm: ns.getServerMaxMoney(target), ma: ns.getServerMoneyAvailable(target) }
	return prepped;
}


async function distributeThreads(ns, action, threads, target, note) {
	ns.print("distributor start");
	let hosts = sn.scanNetwork(ns)
	if (!(ns.args[1] === "home")) {
		hosts.splice(hosts.indexOf("home"), 1);
	}
	hosts = hosts.filter(el => ns.hasRootAccess(el));
	hosts = hosts.sort((a, b) => ns.getServerMaxRam(b) - ns.getServerMaxRam(a));
//	ns.print("hostlist: " + hosts)
	let remainingThreads = threads;
//	ns.print("start threads: "+remainingThreads);
	let sThreads = 0;
	let script = action + ".js";
	let host = "";
	let maxThreads = 0;
	note = JSON.stringify(note);

	let hackFiles = ["hack.js", "weaken.js", "grow.js", "bp_advancedCycle.js", "bp_rootServer.js"]
	for (let h in hosts) {
		let hostFiles = ns.ls(hosts[h]);
		let scpFiles = hackFiles.filter(item => !hostFiles.includes(item)) || [];
		scpFiles = hackFiles //overwrite Testing.  Remove Later
		if (scpFiles.length > 0) {
			await ns.scp(scpFiles, hosts[h]);
		}
	}
	for (let i in hosts) {
		if (remainingThreads > 0) {
			host = hosts[i];
			maxThreads = getHostMaxThreads(ns, host, script, host);
			if (maxThreads < remainingThreads) {
				sThreads = maxThreads;
				if (sThreads > 0) {
			//		ns.print(script, host, sThreads, target, note);
					ns.exec(script, host, sThreads, target, note);
					remainingThreads = remainingThreads - sThreads;
			//		ns.print("remaining threads "+remainingThreads)

				}
			} else {
				sThreads = remainingThreads;
				if (sThreads > 0) {
				//	ns.print(script, host, sThreads, target, note);
					ns.exec(script, host, sThreads, target, note);
					remainingThreads = remainingThreads - sThreads;
				}
			}
		}
	}
	return remainingThreads;
}

function batchScheduler(ns, target, startTime, batchNo, btr) {
	//ns.print(btr);
	// 1 batch = batch number, batch start time, 4 actions schedule,batch end time, and max threads.
	let batchSchedule = [];
	let aTimes = getActionsTimes(ns, target);

	//action // action, threads, actionDuration, start time, end time
	let actions = ["wh", "gr", "wg", "ha"];
	let actionTypes = ["weaken", "grow", "weaken", "hack"];
	for (let i in actions) {
		let action = actions[i];
		let actionType = actionTypes[i];
		batchSchedule.push(actionEvent(ns, target, batchNo, action, actionType, btr));
	}
	let totalBatchTime = batchSchedule.map(o => o.aDuration).reduce((prev, curr) => prev + curr + 500, 0);
	let batchEnd = totalBatchTime + startTime;
	batchSchedule = updateBatchTimes(ns, batchSchedule, batchEnd);
	return batchSchedule;
}

function actionEvent(ns, target, batchNo, action, actionType, btr) {
	let aEvent = {
		aTarget: target,
		aBatch: batchNo,
		aAction: action,
		aActionType: actionType,
		aStart: 0,
		aDuration: 0,
		aEnd: 0,
		aThreads: 1
	};
	let at = getActionsTimes(ns, target);

	switch (actionType) {
		case "weaken":
			aEvent.aDuration = Math.max(at.weakenT, 2000);
			break;
		case "grow":
			aEvent.aDuration = Math.max(at.growT, 2000);
			break;
		case "hack":
			aEvent.aDuration = Math.max(at.hackT, 2000);
			break;
	}

	switch (action) {
		case "wh":
			aEvent.aThreads = Math.floor(Math.max(btr.whThr, 1));
			break;
		case "gr":
			aEvent.aThreads = Math.floor(Math.max(btr.gThr, 1));
			break;
		case "wg":
			aEvent.aThreads = Math.floor(Math.max(btr.wgThr, 1));
			break;
		case "ha":
			aEvent.aThreads = Math.floor(Math.max(btr.hThr, 1));
			break;

	}
	return aEvent;
}

function updateBatchTimes(ns, batchSchedule, batchEnd) {
	for (let i = 0; i < batchSchedule.length; i++) {
		batchSchedule[i].aEnd = batchEnd - (batchSchedule.length - i) * 2000;
		batchSchedule[i].aStart = batchSchedule[i].aEnd - batchSchedule[i].aDuration;
	}
	return batchSchedule;
}

function sleepTime(ns, actionEvent, nextAction) {
	let sleepT = 2000;
	sleepT = nextAction.aStart - actionEvent.aEnd;
	return sleepT;
}

async function launcher(ns, queue) {
	ns.print("Launcher Start");
	queue = queue.sort((a, b) => a.aStart - b.aStart);
	//	ns.print(queue);
	for (let i = 0; i < queue.length; i++) {
		ns.print("running" + JSON.stringify(queue[i]));
		let actionEvent = queue[i];
		ns.print("Action Threads: " + actionEvent.aThreads);
		await distributeThreads(ns, actionEvent.aActionType, actionEvent.aThreads, actionEvent.aTarget, [actionEvent.aAction, actionEvent.aBatch]);
		if (i < (queue[0].length - 1)) {
			ns.print("sleeping: " + sleepTime)
			await ns.sleep(sleepTime(ns, queue[i], queue[i + 1]))
		} else
			ns.print("sleeping: 2000")
		await ns.sleep(2000);
	}
}

export async function main(ns) {
	ns.disableLog("ALL");


	let target = ns.args[0];
	let action = "weaken";

	let  serv = ns.getServer(target);

	if ((ns.hasRootAccess(target) === true) && (ns.getHackingLevel() > ns.getServerRequiredHackingLevel(target))) {

		while (true) {
			if (ns.getWeakenTime(target) > 500000 && getTotalFreeRam(ns) < 50000) {
				break;
			}
			//		await prepServer(ns, target);

			let btr = await batchThreadReqs(ns, target);
			let hostsFreeRam = getTotalFreeRam(ns);
			//		if (btr.batch < hostsFreeRam) {
			//******************new process

			let batchNo = [1, 2, 3];
			let queue = [];
			let batchStart = 0;



			for (let i = 0; i < 3; i++) {
				if (queue.length > 0) {
					batchStart = Math.max.apply(Math, queue.map(function (o) { return o.aEnd })) + 500;
				}

				let batch = batchScheduler(ns, target, batchStart, batchNo[i], btr)

				for (let j = 0; j < batch.length; j++) {
					queue.push(batch[j]);

				}
			}

			queue = queue.sort((a, b) => a.aStart - b.aStart);
		//	ns.print(queue);
			await launcher(ns, queue);
			await ns.sleep(500);
		}
		//		}

		//end new process******************

		/**********old process
		 let script = action + ".script";
	let host = ns.getHostname();
	let threads = 1;
	let note = "";
	let ahackTime = 2000;
	let aGrowTime = 2000;
	let aWeakenTime = 2000;
	let sleepTime = 2000;
	let moreThreads = 0;
		
	let status = { hackStatus: 1, growStatus: 1, weakenStatus: 1 }
	let completionStatus = 1;
	let times = { hackTimeS: 2000, growTimeS: 2000, weakenTimeS: 2000 };
	let nextTime = 2000; 
		
				while (nextTime < 300000) {  //while loop does action by action
					action = getAction(ns, target);
					note = getNote(ns, target)
					script = action + ".script";
					threads = getActionThreads(ns, target, action)
					if (threads > 0) {
						if (ns.getWeakenTime(target) > 300000) {
							nextTime = 300001;
						}
						moreThreads = await distributeThreads(ns, action, threads, target, note); //this is the action thing
						status = statusUpdate(ns, status, moreThreads, action);
						times = timesUpdate(ns, times, action, target);
						ns.print(status);
						ns.print(times);
						completionStatus = ns.nFormat(Math.max(status.weakenStatus, status.hackStatus, status.growStatus), "0.00a");
					}
					sleepTime = sleepToNextAction(ns, action, getNextAction(ns, action, target), target);
					ns.print(sleepTime);
					await ns.sleep(sleepTime);
				} **********/
		/*		while (true) {
					await ns.sleep(2000);
				}
		*/

	} else {
		ns.tprint(`Can't hack ${target} yet.`)
	}
	ns.tprint("closed advancedCycle " + target);

}
