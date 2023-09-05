/** @param {NS} ns */

export function writeHackDataToPort(ns,port, target, action,result, threads, time) {
	let portInfo = { target: target, action: action, result: result, threads: threads, time: time }
	ns.writePort(port, JSON.stringify(portInfo))
}

export async function main(ns) {
let target = ns.args[0];
	let stockOpt = ns.args[1] || false;
	let result = await ns.hack(target,{stock:stockOpt});
	writeHackDataToPort(ns, 1, target, "hack", result,1, Date.now())
}