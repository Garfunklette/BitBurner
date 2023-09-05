/** @param {NS} ns **/
function moneyInfo(ns) {

	let money = ns.getServerMoneyAvailable("home")
	ns.print("Money " + ns.formatNumber(money, "0.00a"));

	return money
}

function stocksInfo(ns) {
	let syms = ns.stock.getSymbols();
	let stockWorth = 0;
	for (let i of syms) {
		let pos = ns.stock.getPosition(i)
		stockWorth = stockWorth + pos[0] * pos[1] + pos[2] * pos[3];
	}
	ns.print("Stockworth: " + ns.formatNumber(stockWorth, "0.00a"))
	return stockWorth
}

function networthInfo(ns) {
		let money = moneyInfo(ns);
	let stocks = stocksInfo(ns);
	let networth = money + stocks;
	return networth
}

function homeRamInfo(ns) {
    let homeRam = ns.getServerMaxRam("home");
    return homeRam;
}


export async function main(ns) {
    const doc = document; // This is expensive! (25GB RAM) Perhaps there's a way around it? ;)
    const hook0 = doc.getElementById('overview-extra-hook-0');
    const hook1 = doc.getElementById('overview-extra-hook-1');
    const hook2 = doc.getElementById('overview-extra-hook-2');

    while (true) {
        try {
            const headers = []
            const values = [];
            // Add script income per second
            headers.push("StocksValue");
            values.push(ns.formatNumber(stocksInfo(ns),"0.00a"));
            // Add script exp gain rate per second
            headers.push("Networth");
            values.push(ns.formatNumber(networthInfo(ns),"0.00a"));
            // TODO: Add more neat stuff
            headers.push("homeRam");
            values.push(ns.formatNumber(homeRamInfo(ns),"0.00a"));



            // Now drop it into the placeholder elements
            hook0.innerText = headers.join(" \n");
            hook1.innerText = values.join("\n");
        } catch (err) { // This might come in handy later
            ns.print("ERROR: Update Skipped: " + String(err));
        }
        await ns.sleep(1000);
    }
   }