/** @param {NS} ns */

export function writeHackDataToPort(ns,port, target, action, threads, time) {
	let portInfo = { target: target, action: action, threads: threads, time: time }
	ns.writePort(port, JSON.stringify(portInfo))
}

export async function main(ns) {
ns.print(ns.getRunningScript())
}