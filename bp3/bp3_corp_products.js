import * as hCorp from "bp3_helpers_corp.js"
/** @param {NS} ns */
export async function main(ns) {
	while(true) {
		
	let allProducts = [];
	let divs = ns.corporation.getCorporation().divisions
	for (let i of divs) {
		let div = ns.corporation.getDivision(i)
		if (div.makesProducts === true) {
			hCorp.setMarketPrices(ns, i)
			let cities = div.cities;
			for (let j of cities) {
				for (let k of div.products) {

					let prod = ns.corporation.getProduct(i, j, k)
					allProducts.push(prod);
				}
			}
		}
	}
	ns.print(allProducts)
	for(let p of allProducts) {
		let keys = Object.keys(p);
		let vals = Object.values(p);
		for(let q in keys) {
			ns.print(keys[q]," ",vals[q])
		}
	}
	await ns.sleep(10000)
	ns.clearLog()
	}
}