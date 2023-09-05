/** @param {NS} ns */
import *  as cSolver from "bp3_contract_solvers.js"
import * as cContractList from "bp3_contract_getList.js"
export async function main(ns) {
	ns.disableLog('ALL')
	let list = cContractList.getContractList(ns);

	for (let i of list) {
		let type = ns.codingcontract.getContractType(i[0], i[1])

		if (type === "Algorithmic Stock Trader I") {
			ns.print(i[0], i[1])
			let answer = cSolver.algorithmicStockTraderI(ns, i[0], i[1]);
			ns.print(answer);
			ns.tprint(ns.codingcontract.attempt(answer, i[0], i[1]))
		}
		if (type === "Encryption I: Caesar Cipher") {
			ns.print(i[0], i[1])
			let answer = cSolver.caesarCipher(ns, i[0], i[1]);
			ns.print(answer);
			ns.tprint(ns.codingcontract.attempt(answer, i[0], i[1]))
		}
		if (type === "Encryption II: Vigenère Cipher") {
			ns.print(i[0], i[1])
			let answer = cSolver.vigenereCipher(ns, i[0], i[1]);
			ns.print(answer);
			ns.tprint(ns.codingcontract.attempt(answer, i[0], i[1]))
		}

		if (type === "Find Largest Prime Factor") {
			ns.print(i[0], i[1])
			let answer = cSolver.findLargestPrimeFactor(ns, i[0], i[1]);
			ns.print(answer);
			ns.tprint(ns.codingcontract.attempt(answer, i[0], i[1]))
		}
		if (type === "Spiralize Matrix") {
			//		ns.print(i[0], i[1])
			//	cSolver.spiralizer(ns, i[0], i[1])
		}

		if (type === "Subarray with Maximum Sum") {
			ns.print(i[0], i[1])
			let answer = cSolver.subarrayWithMaximumSum(ns, i[0], i[1]);
			ns.print(answer);
			ns.tprint(ns.codingcontract.attempt(answer, i[0], i[1]));
		}
	}
}