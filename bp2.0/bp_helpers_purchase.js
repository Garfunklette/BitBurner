/** @param {NS} ns */

export function getHashMoneyAvailable(ns) {
	let noHashes = ns.hacknet.numHashes();
	let hashMoney = Math.floor(noHashes / 4 * 1000000);
	return hashMoney;
}

export function hashMoney(ns, money) {
	let done = false;
	let noSellHashes = Math.ceil(money / 1000000 * 4)
	let hashMoneyAvailable = getHashMoneyAvailable(ns);
	if (money < hashMoneyAvailable) {
		ns.print("Selling hashes " + noSellHashes)
		done = ns.hacknet.spendHashes("Sell for Money", "", noSellHashes)
	} else {
		ns.print("Not enough hashes.");
		ns.print(ns.hacknet.numHashes()," / ", noSellHashes)
	}
	return done;
}

export function moneyCheck(ns, goal) {
	let money = ns.getServerMoneyAvailable("home");
	if (money < goal) {
		return false;
	}
	return true;
}

export function shortBy(ns, goal) {
	let money = ns.getServerMoneyAvailable("home");
	let short = goal - money;
	if (short < 0) {
		return 0;
	} else {
		return short;
	}
}

export function canBuyCheck(ns, goal) {
	if (moneyCheck(ns, goal) === false) {
		let short = shortBy(ns, goal);
		ns.print("hashes sold? ", hashMoney(ns, short));
	}
	return moneyCheck(ns, goal);
}


export async function main(ns) {





}
