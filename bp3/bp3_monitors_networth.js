/** @param {NS} ns */

function moneyInfo(ns) {

	let money = ns.getServerMoneyAvailable("home")
	ns.print("Money " + ns.nFormat(money, "0.00a"));

	return money
}

function stocksInfo(ns) {
	let syms = ns.stock.getSymbols();
	let stockWorth = 0;
	for (let i of syms) {
		let pos = ns.stock.getPosition(i)
		stockWorth = stockWorth + pos[0] * pos[1] + pos[2] * pos[3];
	}
	ns.print("Stockworth: " + ns.nFormat(stockWorth, "0.00a"))
	return stockWorth
}

function networthInfo(ns) {
		let money = moneyInfo(ns);
	let stocks = stocksInfo(ns);
	let networth = money + stocks;
	return networth
}


export async function main(ns) {
	ns.disableLog('ALL');
		ns.tail();
	let money = moneyInfo(ns);
	let stocks = stocksInfo(ns);
	let networth = money + stocks;

	if (ns.args[0] === "alert") {
		ns.toast(ns.nFormat(networth,"0.00a"),"success");
	} else {

		while (true) {
		
			let money = moneyInfo(ns);
			let stocks = stocksInfo(ns);
			let networth = money + stocks;
			ns.print("networth: " + ns.nFormat(networth, "0.00a"))

			await ns.sleep(10000)
			ns.clearLog()
		}
	}


}