/** @param {NS} ns */
import * as hServers from "bp3_helpers_servers.js"
export async function main(ns) {
	let target = ns.args[0];
	hServers.connectToServer(ns, target)
}