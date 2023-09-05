/** @param {NS} ns */

//if 4S Tix
//get expected returns and rank
//else get history
//if going down
//sell stocks
//if going up
//buy stocks

export function getMyStocks(ns) {
	let symbols = ns.stock.getSymbols()
	let myStocks = [];
	for (let i of symbols) {
		let pos = ns.stock.getPosition(i)
		if (pos[0] > 0 || pos[2] > 0) {
			myStocks.push(i)
		}
	}
	return myStocks;
}

export function getBankRoll(ns) {
	let bankRoll = ns.getServerMoneyAvailable("home") - 5e9;
	bankRoll = (bankRoll < 0 ? 0 : bankRoll)
	return bankRoll;
}

export function getMaxAffordableShares(ns, sym) {
	let bankRoll = getBankRoll(ns)
	let price = ns.stock.getPrice(sym)
	let free = getAvailableShares(ns, sym);
	let affordableShares = Math.min(bankRoll / price, free);
	return affordableShares;
}

export function getAvailableShares(ns, sym) {
	let max = ns.stock.getMaxShares(sym);
	let pos = ns.stock.getPosition(sym)
	let owned = pos[0] + pos[2];
	let free = max - owned;
	return free;
}

export function buyStocks(ns, sym, orderType) {
	let bankRoll = getBankRoll(ns);
	let affordable = getMaxAffordableShares(ns, sym);
	if (orderType === "short") {
		ns.stock.buyShort(sym, affordable);
		bankRoll = getBankRoll(ns);
	} else {
		ns.stock.buyStock(sym, affordable);
		bankRoll = getBankRoll(ns);
	}
	return bankRoll;
}

export function sellStocks(ns, sym, orderType) {
	let bankRoll = getBankRoll(ns);
	let pos = ns.stock.getPosition(sym);
	let longShares = pos[0]
	let shortShares = pos[2]
	if (orderType === "short") {
		ns.stock.sellShort(sym, shortShares)
		bankRoll = getBankRoll(ns)
	} else {
		ns.stock.sellStock(sym, longShares)
		bankRoll = getBankRoll(ns)
	}
	return bankRoll;
}

export function getExpectedReturn(ns,sym) {
	let expRet = ns.stock.getVolatility(sym) * (2* (ns.stock.getForecast(sym)-.5))/2;
	return expRet;
}

export function monitor(ns) {
	let mystocks = getMyStocks(ns);
		ns.print(ns.formatNumber(getBankRoll(ns),"0.00a"));

	for(let i of mystocks) {
		let forecast = ns.formatPercent(ns.stock.getForecast(i));
		let position = ns.stock.getPosition(i);
		let value = ns.formatNumber(position[0]*position[1]+position[2]*position[3],"0.00a")
		ns.print(i, " ",forecast," ",position," ",value);
	}
}

function refresh(ns, stocks, myStocks) {
	let corpus = ns.getServerMoneyAvailable("home");
	myStocks.length = 0;
	for (let i = 0; i < stocks.length; i++) {
		let sym = stocks[i].sym;
		stocks[i].price = ns.stock.getPrice(sym);
		stocks[i].shares = ns.stock.getPosition(sym)[0];
		stocks[i].buyPrice = ns.stock.getPosition(sym)[1];
		stocks[i].vol = ns.stock.getVolatility(sym);
		stocks[i].prob = 2 * (ns.stock.getForecast(sym) - 0.5);
		stocks[i].expRet = stocks[i].vol * stocks[i].prob / 2;
		corpus += stocks[i].price * stocks[i].shares;
		if (stocks[i].shares > 0) myStocks.push(stocks[i]);
	}
	stocks.sort(function (a, b) { return b.expRet - a.expRet });
	return corpus;
}

export async function main(ns) {

}