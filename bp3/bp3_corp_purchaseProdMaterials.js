/** @param {NS} ns */
export async function buyProductionMaterial(ns, div, city, material, goalQty) {
	let qty = ns.corporation.getMaterial(div, city, material).stored
	//ns.print(material, " ", goalQty, " ", qty)
	if (qty < goalQty) {
		let buyQty = Math.min((goalQty - qty), Math.floor(ns.corporation.getCorporation().funds / ns.corporation.getMaterial(div, city, material).marketPrice))
		if (buyQty > 0)
			ns.print("Buying prod mats " + div, city, material)
		ns.corporation.bulkPurchase(div, city, material, buyQty)
	}
}
export async function main(ns) {
	let materials = ["Real Estate", "Hardware", "Robots", "AI Cores"]
	let matQtys = [40000, 3333, 360, 2000]

	let div = ns.corporation.getDivision("CompostBin")
	let cities = div.cities;
	for (let i of cities) {
		for (let j in materials) {
			buyProductionMaterial(ns, div.name, i, materials[j], matQtys[j])
		}
	}


}