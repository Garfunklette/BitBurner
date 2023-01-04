/** @param {NS} ns */
export async function main(ns) {

	let serverSize = ns.args[0]
	let servers = ns.getPurchasedServers();
	for (let i of servers) {
		if (ns.getServerMaxRam(i) <= serverSize) {
			ns.killall(i)
			ns.deleteServer(i);
		}
	}

}
