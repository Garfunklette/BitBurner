/** @param {NS} ns */
import * as hHacking from "bp3_helpers_hacking.js"
import * as hServers from "bp3_helpers_servers.js"

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

export async function main(ns) {
	//  let args = JSON.parse(ns.args);
	let args = [];
	let target = args[0] || ns.args[0];
	ns.disableLog('ALL')
	let batchName = args[1] || ns.args[1];
	let waitTime = args[2] || ns.args[2] || 0;
	let earlyGame = args[3] || false;

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
		await ns.sleep(1000);
	}
}