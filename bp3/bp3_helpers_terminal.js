/** @param {NS} ns */

import {getRootAccess,startFindPath} from "bp3_helpers_servers.js"

export async function connectToServerAndHack(ns, target) {
	ns.print("Start connectToServarAndHack ",target)
	getRootAccess(ns, target)
	if (ns.getServerRequiredHackingLevel(target) < ns.getHackingLevel()) {
		let results = startFindPath(ns, target);
		for (let i of results) {
			ns.singularity.connect(i);
		}
		ns.tprint(await ns.hack(target));
		await ns.sleep(20000);
	}
	ns.singularity.connect("home");
}

export async function connectToServerAndBackdoor(ns, target) {
	ns.print("Start connectToServarAndBackdoor ",target)
	getRootAccess(ns, target)
	if (ns.getServerRequiredHackingLevel(target) < ns.getHackingLevel()) {
		let results = startFindPath(ns, target);
		for (let i of results) {
			ns.singularity.connect(i);
		}
		ns.tprint(await ns.singularity.installBackdoor(target));
	}
	ns.singularity.connect("home");
}

export async function main(ns) {
	
}