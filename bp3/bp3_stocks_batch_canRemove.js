/** @param {NS} ns */

import * as dServers from "bp3_data_servers.js"
import * as dStocks from "bp3_data_stocks.js"
import * as hHacking from "bp3_helpers_hacking.js"
import * as hServers from "bp3_helpers_servers.js"

/*
export function influenceStockThroughServerGrow(server: Server, moneyGrown: number): void {
	const orgName = server.organizationName;
	let stock: Stock | null = null;
	if (typeof orgName === "string" && orgName !== "") {
		stock = StockMarket[orgName];
	}
	if (!(stock instanceof Stock)) {
		return;
	}

	const percTotalMoneyGrown = moneyGrown / server.moneyMax;
	if (Math.random() < percTotalMoneyGrown) {
		stock.changeForecastForecast(stock.otlkMagForecast + forecastForecastChangeFromHack);
	}
}
*/

function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}

function getMyStocks(ns) {
	let syms = ns.stock.getSymbols(ns)
	let myStocks = [];
	for (let i of syms) {
		let pos = ns.stock.getPosition(i);
		if (pos[0] > 0) {
			myStocks.push(i)
		}
	}
	return myStocks;
}

async function growStock(ns, sym) {
	let target = getServerBySym(ns, sym);
	let script = "bp3_stocks_grow.js"
	let hostServers = hServers.getAvailableHostServers(ns, ns.getScriptRam(script, "home"));
	await hHacking.scpHackingScripts(ns, hostServers, [script])
	let mgp = hHacking.getMaxGrowthPercent(ns, target);
	let totalThreads = hHacking.getGrowThreads(ns, target, mgp)
	hHacking.distributeThreads(ns, script, hostServers, totalThreads, target, "g", "stock", 0)
}

function getServerBySym(ns, sym) {
	let org = getKeyByValue(dStocks.StockSymbol, sym);
	let serverData = dServers.ServerMetadata.find(el => el.organizationName === org);
	return serverData.hostname;
}

function getSymByServer(ns,server) {
	let serverData = dServers.ServerMetadata.find(el => el.hostname === server);
	ns.print(serverData);
	let sym = dStocks[serverData][organizationName]
	ns.print(sym)
	return sym;
}


export async function main(ns) {
	let myStocks = getMyStocks(ns)
	ns.print(getMyStocks(ns))
	for (let i of myStocks) {
		let target = getServerBySym(ns, i)
		if (!hHacking.minSec(ns, target)) {

		} else {
			if (!hHacking.maxMoney(ns, target)) {
				await growStock(ns, i)
				ns.print(ns.getServer(target))
			}
		}
	}
}