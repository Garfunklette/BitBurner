/** @param {NS} ns */
export async function main(ns) {
	if (ns.args[0] === undefined) {
		let types = ns.codingcontract.getContractTypes();
		for (let i of types) {
			ns.print(i);
		}
	} else {
		ns.codingcontract.createDummyContract(ns.args[0])
	}
}