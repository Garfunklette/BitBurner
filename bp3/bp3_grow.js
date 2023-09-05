/** @param {NS} ns */
export function writeHackDataToPort(ns,port, target, action,result, threads, time) {
	let portInfo = { target: target, action: action, result: result, threads: threads, time: time }
	ns.writePort(port, JSON.stringify(portInfo))
}
export async function main(ns) {
	let target = ns.args[0];
	let stockOpt = ns.args[1] || false;
	let result = await ns.grow(target,{stock:stockOpt});
	writeHackDataToPort(ns, 1, target,"grow", Math.floor(result*1000)/1000,1, Date.now())
}