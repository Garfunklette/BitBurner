/** @param {NS} ns */
import * as hServers from "bp3_helpers_servers.js"

export function getContractList(ns) {
	let net = hServers.networkScan(ns);
	let contracts = [];
	for (let i of net) {
		let files = ns.ls(i)
		for (let j of files) {
			if (j.includes(".cct")) {
				let type = ns.codingcontract.getContractType(j, i)
				contracts.push([j, i, type]);
			}
		}
	}
	return contracts;
}

export async function main(ns) {
	ns.disableLog('ALL')
	ns.tail();
	let list = [];
	while (true) {
		list = getContractList(ns);
		if (list.length > 0) {
			ns.run("bp3_contract_solveAll.js")
		}
		list = getContractList(ns);
		if (list.length > 0) {
			if (list.length < 5) {
				ns.toast(JSON.stringify(list), "info");
			} else {
				ns.toast(list.length + " contracts available")
			}
			list.sort((a, b) => a[2] - b[2]);
			for (let i of list) {
				ns.print(i[1], " ", i[0], " ", ns.codingcontract.getContractType(i[0], i[1]));
			}

		}
		await ns.sleep(60000);
		ns.clearLog();
	}
}