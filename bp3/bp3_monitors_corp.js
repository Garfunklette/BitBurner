/** @param {NS} ns */

function nFormatAll(ns,strings) {
	let formatted = [];
	for(let i of strings) {
		formatted.push(ns.formatNumber(i,"0.00a"))
	}
	return formatted;
}

export async function main(ns) {
	ns.disableLog('ALL');
	ns.tail();
	let div = "PuffinPuffin"
	while (true) {

		let products = ns.corporation.getDivision(div).products;
		for (let i of products) {
			let prod = ns.corporation.getProduct(div, i)
			let output1= nFormatAll(ns,[prod.rat])
			let output2 = nFormatAll(ns,prod.cityData["Aevum"])
				ns.print(i," ",output1," ",output2," ",prod.sCost)
		}

		await ns.sleep(800)
		ns.clearLog();
	}
}