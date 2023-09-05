/** @param {NS} ns */

import * as hServers from "bp3_helpers_servers.js"
import * as hHacking from "bp3_helpers_hacking.js";
import { TextTransforms } from "gx_textTransforms.js"

function getRunningBatchActions(ns, target) {
	let actions = ["h", "w1", "g", "w2"];
	let scripts = ["bp3_hack.js", "bp3_weaken.js", "bp3_grow.js", "bp3_weaken.js"]

	let allRunningScripts = getAllRunningScripts(ns);
	let runningActions = [];
	for (let i of allRunningScripts) {
		if (i.args[0] === target) {
			for (let j in actions) {
				if (i.args.indexOf(actions[j]) > 0 && runningActions.indexOf(actions[j]) < 0) {
					runningActions.push(actions[j]);
				}
			}
		}
	}
	return runningActions;
}

export function getRunningManagers(ns, script = "bp3_hacking_manager.js") {
	let allRunningScripts = getAllRunningScripts(ns);
	let runningManagers = [];
	for (let i of allRunningScripts) {
		if (i.filename === script)
			runningManagers.push(i.args[0]);
	}
	return runningManagers;
}

export function buffer(element, list) {
	let maxLen = element.length;
	let buffer = ""
	for (let i of list) {
		if (i.length > maxLen) {
			maxLen = i.length;
		}
	}
	buffer = buffer + ' '.repeat(maxLen - element.length)
	return buffer;
}

export function hackTargetInfo(ns, target) {
	let serv = ns.getServer(target);
	let money = ns.formatNumber(serv.moneyAvailable, "0.00a")
	let moneyPerc = serv.moneyAvailable / serv.moneyMax;
	if (moneyPerc < .5) {
		moneyPerc = TextTransforms.apply(ns.formatPercent(moneyPerc, "0.00%"), [TextTransforms.Color.BrightRed]);
	} else {
		if (moneyPerc < .95) {
			moneyPerc = TextTransforms.apply(ns.formatPercent(moneyPerc, "0.00%"), [TextTransforms.Color.Yellow]);
		} else {
			moneyPerc = ns.formatPercent(moneyPerc, "0.00%")
		}
	}
	//ns.print(TextTransforms.apply('Hello World',[TextTransforms.Highlight.Red,TextTransforms.Color.White,TextTransforms.Transform.Underline]));


	let sec = ns.formatNumber(serv.hackDifficulty, "0.00a");
	let secPlus = ns.formatNumber((serv.hackDifficulty - serv.minDifficulty), "0.00a");
	let wTime = ns.formatNumber(ns.getWeakenTime(target) / 1000, "0.0");
	let bThreads = ns.formatNumber(hHacking.getMaxBatchThreads(ns, target)[0], "0.00a");
	let runningActions = getRunningBatchActions(ns, target);
	let servInfo = {
		sName: target,
		sMoney: money,
		sMoneyPerc: moneyPerc,
		sSec: sec,
		sSecPlus: secPlus,
		sWeakenTime: wTime,
		sBatchThreads: bThreads,
		sMgrs: [],
		sActions: runningActions
	};
	let allRunningScripts = getAllRunningScripts(ns);
	let batchNames = ["a", "b", "c","d","e","f","g","h","i", "prep"];
	for (let i of allRunningScripts) {
		for (let j of batchNames) {
				if (i.filename === "bp3_hacking_batch.js" && i.args[0] === target && i.args[1]===j && servInfo.sMgrs.indexOf(j)<0 ) {
			
				servInfo.sMgrs.push(j)
			}
			if (i.filename === "bp3_hacking_prepBatch.js" && i.args[0] === target && i.args[1]===j&& servInfo.sMgrs.indexOf(j)<0 ) {
			
				servInfo.sMgrs.push(j)
			}
		}
	//	ns.print("sMgrs check",i.args[0],servInfo.sMgrs)
	}
	
	return servInfo;
}

export function getAllRunningScripts(ns) {
	let network = hServers.networkScan(ns);
	let allRunningScripts = [];
	for (let i of network) {
		let scripts = ns.ps(i);
		for (let j of scripts) {
			let script = j;
			script["host"] = i;
			allRunningScripts.push(j)
		}
	}
	return allRunningScripts;
}

export async function main(ns) {
	ns.disableLog('scan');
	let target = "n00dles"
	ns.tail();
	while (true) {

		ns.print(getRunningBatchActions(ns, target))
		await ns.sleep(2000)
		ns.clearLog();
	}
}