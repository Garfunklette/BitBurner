/** @param {NS} ns */
export async function main(ns) {

	let programNames = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"]
	let exes = ns.ls("home", ".exe");
	if (ns.hasTorRouter() === false) {
		if (ns.singularity.purchaseTor()) {
			ns.tprint("Purchased TOR");
		}
	}
	programNames = programNames.filter(el => exes.indexOf(el) < 0);
	for (let i of programNames) {
		if (ns.singularity.purchaseProgram(i)) {
			ns.tprint("Purchased program " + i);
		}

	}

}