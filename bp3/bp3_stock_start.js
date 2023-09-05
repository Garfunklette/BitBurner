/** @param {NS} ns */

function stuffCheck(ns) {
	return ns.stock.hasWSEAccount() && ns.stock.hasTIXAPIAccess && ns.stock.has4SData() && ns.stock.has4SDataTIXAPI()
}

function getAllStockStuff(ns) {
	if (!ns.stock.hasWSEAccount() && ns.getServerMoneyAvailable("home") > 200e6 * 1.1) {
		ns.stock.purchaseWseAccount();
	}
	if (!ns.stock.hasTIXAPIAccess() && ns.getServerMoneyAvailable("home") > 5e9 * 1.1) {
		ns.stock.purchaseTixApi();
	}
	if (!ns.stock.has4SData() && ns.getServerMoneyAvailable("home") > 1e9 * 1.1) {
		ns.stock.purchase4SMarketData();
	}
	if (!ns.stock.has4SDataTIXAPI() && ns.getServerMoneyAvailable("home") > 25e9 * 1.1) {
		ns.stock.purchase4SMarketDataTixApi();
	}
}


export async function main(ns) {
	getAllStockStuff(ns);
	if (stuffCheck) {
		ns.exec("bp3_stocks_4SManager.js", "home", { preventDuplicates: true })
	} else {
		ns.tprint("Need more stock things before running stockMaster")
	}
}