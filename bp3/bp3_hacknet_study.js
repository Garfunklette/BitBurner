/** @param {NS} ns */
export async function main(ns) {

	while (true) {

		let numHash = ns.hacknet.numHashes();
		let cost = ns.hacknet.hashCost("Improve Studying")
		while (numHash > cost) {
			await ns.hacknet.spendHashes("Improve Studying");
			numHash = ns.hacknet.numHashes();
			cost = ns.hacknet.hashCost("Improve Studying")
		}

		await ns.sleep(10000)
	}

}