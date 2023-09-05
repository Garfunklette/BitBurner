/** @param {NS} ns */

function numRunningScripts(ns, script, scriptArgs) {
	let numScripts = 0;
	let stringArgs = JSON.stringify(scriptArgs)
	let allScripts = ns.ps("home");
	for (let i of allScripts) {
		if (i.filename === script && JSON.stringify(i.args) === stringArgs) {
			numScripts++
		}
	}
	return numScripts;
}

function maxBatch(ns, target) {
	let wTime = ns.getWeakenTime(target);
	let maxBatchNum = Math.floor(wTime / 4) + 1
	return maxBatchNum;
}

export async function main(ns) {
	let target = ns.args[0] || "n00dles"

	let numRun = numRunningScripts(ns, "bp3_hacking_batch.js", [target, "a", 0, true])
	ns.print(numRun)
	let maxB = maxBatch(ns, target);


	while (true) {

		numRun = numRunningScripts(ns, "bp3_hacking_batch.js", [target, "a", 0, true])
		if (numRun < maxB)
			ns.exec("bp3_hacking_batch.js", "home", 1, target, "a", 0, true);
		maxB = maxBatch(ns, target);
		await ns.sleep(4000)
	}
}