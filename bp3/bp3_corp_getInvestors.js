/** @param {NS} ns */
import { updateMaterialPrices } from "bp3_helpers_corp.js"



export async function main(ns) {

	let goal = ns.args[0];
	let offer = ns.corporation.getInvestmentOffer();
	while (true) {
		let divisions = ns.corporation.getCorporation().divisions
		for (let i of divisions) {
			let cities = ns.corporation.getDivision(i).cities
			for (let j of cities) {
				updateMaterialPrices(ns, i, j)
			}
		}

		offer = ns.corporation.getInvestmentOffer();
		ns.print(offer);
		ns.print(ns.formatNumber(offer.funds));
		if (offer.funds > goal) {
			ns.corporation.acceptInvestmentOffer();
			break;
		}
		await ns.sleep(1000)
	}
	ns.tprint("Accepted offer: " + offer.funds);
}