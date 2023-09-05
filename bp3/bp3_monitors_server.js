/** @param {NS} ns */
import * as hMonitors from "bp3_helpers_monitors.js"

export async function main(ns) {
	let target = ns.args[0];
	ns.tail();
	while (true) {

		hMonitors.hackTargetInfo(ns, target);

		await ns.sleep(10000);
		ns.clearLog();
	}
}