/** @param {NS} ns */

import * as hStock from "bp3_helpers_stock.js"

//if 4S Tix
//get expected returns and rank
//else get history
//if going down
//sell stocks
//if going up
//buy stocks
export async function main(ns) {
	ns.disableLog('ALL');
	let bankRoll = Math.min(hStock.getBankRoll(ns, 0.8), 5e9)
	while (true) {
		let myStocks = hStock.getMyStocks(ns);

		//sell phase;
		let bearish = myStocks.filter(el => ns.stock.getForecast(el) < .45);
		for (let i of bearish) {
			let longQty = ns.stock.getPosition(i)[0];
			if (longQty > 0) {
				hStock.sellStocks(ns, i, "long");
			}
		}

		let bullish = myStocks.filter(el => ns.stock.getForecast(el) > .55);
		for (let j of bullish) {
			let shortQty = ns.stock.getPosition(j)[2];
			if (shortQty > 0) {
				hStock.sellStocks(ns, j, "short");
			}
		}

		//buy phase
		bankRoll = Math.min(hStock.getBankRoll(ns, 0.8), 5e9)
		if (bankRoll > 1e9+100000) {
			let syms = ns.stock.getSymbols();
			let availStocks = syms.filter(el => hStock.getAvailableShares(ns, el) > 0);
			availStocks= availStocks.filter(el=> ns.stock.getForecast(el)>0.55);
			availStocks.sort((a, b) => hStock.getExpectedReturn(ns, b) - hStock.getExpectedReturn(ns, a));
			for(let i of availStocks) {
				if (hStock.getMaxAffordableShares(ns, i)>0) {
					hStock.buyStocks(ns,i,"long");
				}
			}
		}
		hStock.monitor(ns)
		await ns.sleep(60000)
		ns.clearLog();
	}
}