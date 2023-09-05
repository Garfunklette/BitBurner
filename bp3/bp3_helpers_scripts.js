/** @param {NS} ns */

export function getMaxThreads(ns,hostServer,script,scriptHost) {
	ns.print("getMaxThreads: "+hostServer)
	let maxRam = ns.getServerMaxRam(ns,hostServer);
	let scriptRam = ns.getScriptRam(script,scriptHost);
	let maxThreads = Math.floor(maxRam / scriptRam);
	return maxThreads;
}

export async function main(ns) {

}