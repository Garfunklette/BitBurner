/** @param {NS} ns */
import { updateMaterialPrices } from "bp3_helpers_corp.js"
export async function main(ns) {
	while (true) {
		let corp = ns.corporation.getCorporation();
		let divisions = corp.divisions;
		for (let i of divisions) {
			let cities = ns.corporation.getDivision(i).cities;
			for (let j of cities) {
				if(ns.corporation.hasWarehouse(i,j))
				updateMaterialPrices(ns, i, j)
			}
		}
		await ns.sleep(10000);
	}
}