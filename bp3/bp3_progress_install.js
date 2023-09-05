/** @param {NS} ns */
async function stockMarket(ns) {
	if (ns.isRunning("hm_stocks_stock-master.js", "home")) {
		ns.kill("hm_stocks_stock-master.js", "home")
		await ns.sleep(5000);
	}
	ns.exec("bp3_stocks_sellAll.js", "home");
	await ns.sleep(5000);
}

function buyAllWantedAugs(ns) {}
function upgradeComp(ns) {}
function buyNFG(ns) {}
function buyAllOtherAugs(ns) {}

export async function main(ns) {
	ns.killall("home");
	await ns.sleep(10000);
	stockMarket(ns);



}