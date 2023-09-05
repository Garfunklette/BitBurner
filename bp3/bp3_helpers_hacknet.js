/** @param {NS} ns */


export const SERVER_BASE_COST = 720;
export const SERVER_BASE_OUTPUT = .96
export const LEVEL_UPGRADE_OUTPUT = .96
export const RAM_UPGRADE_OUTPUT = .034
export const CORE_UPGRADE_OUTPUT = .16

export function moneyGainRatePerCost(ns, nodeNum, upgradeType, startLevel, startRam, startCores, startMult) {
	let nodeStats = ns.hacknet.getNodeStats(nodeNum);

}




//======Servers=========

export function getAvailableMoney(ns) {
	let numHash = ns.hacknet.numHashes();
	let money = ns.getServerMoneyAvailable("home");
	let availableMoney = money + Math.floor(numHash / ns.hacknet.hashCost("Sell for Money")) * 1e6
	//	ns.print("nHash"+numHash)
	//	ns.print("cashMoney"+money) 
	//	ns.print("totAvailMoney"+availableMoney)
	return availableMoney;
}

export function getBankRoll(ns, percent) {
	let bankRoll = getAvailableMoney(ns) * percent / 100
	return bankRoll
}

export function sellHashesForMoney(ns, goalMoney) {
	let numHash = ns.hacknet.numHashes();
	let money = ns.getServerMoneyAvailable("home");
	if (money < goalMoney) {
		let moneyNeeded = goalMoney - money;
		let count = Math.ceil(moneyNeeded / 1000000)
		let hashesNeeded = count * ns.hacknet.hashCost("Sell for Money");
		if (hashesNeeded < numHash) {
			ns.hacknet.spendHashes("Sell for Money", count)
		}
	}
}

export function sellAllHashesForMoney(ns) {
	ns.hacknet.spendHashes("Sell for Money", "", Math.floor(ns.hacknet.numHashes() / ns.hacknet.hashCost("Sell for Money")))
}

export function sellAtOverCapacity(ns, upgName = "Sell for Money") {
	let hashes = ns.hacknet.numHashes();
	let cap = ns.hacknet.hashCapacity();
	if (hashes / cap > .9) {
		let count = Math.floor((hashes - cap * .9) / ns.hacknet.hashCost(upgName))
		if (count > 0) {
			if (ns.hacknet.spendHashes(upgName, "", count)) {
				ns.print("Sold hashes " + count + " times for " + count * 1e6)
			}
		}

	}
}

export function cacheCheckAndUpgrade(ns) {
	let hashes = ns.hacknet.numHashes();
	let cap = ns.hacknet.hashCapacity();
	let nodeNum = ns.hacknet.numNodes();
	if (cap-hashes < 100) {
		let smallestNode = 0
		let smallestNodeSize = ns.hacknet.getNodeStats(0).hashCapacity;
		for (let i = 0; i < nodeNum; i++) {
			if(ns.hacknet.getCacheUpgradeCost(i) < ns.getServerMoneyAvailable("home")/100) {
				ns.hacknet.upgradeCache(i);
			}
			if(ns.hacknet.getNodeStats(i).hashCapacity < smallestNodeSize) {
				smallestNode = i;
				smallestNodeSize = ns.hacknet.getNodeStats(i).hashCapacity;
			}
		}
		if(ns.getServerMoneyAvailable("home")>ns.hacknet.getCacheUpgradeCost(smallestNode)) {
			ns.hacknet.upgradeCache(smallestNode)
		}
	}
}


export function getAllUpgradeChoices(ns) {

	let upgradeCost = 1e15;
	let score = 0;
	let upgradeList = [];

	for (let i = 0; i < ns.hacknet.numNodes(); i++) {
		let n = ns.hacknet.getNodeStats(i);
		//level
		upgradeCost = ns.hacknet.getLevelUpgradeCost(i, 1)
		score = ns.formulas.hacknetServers.hashGainRate(n.level++, n.ramUsed, n.ram, n.cores) / upgradeCost
		upgradeList.push({ "nodeNum": i, "uName": "Level", "uCost": upgradeCost, "uScore": score })
		n.level--
		//ram
		upgradeCost = ns.hacknet.getRamUpgradeCost(i, 1)
		score = ns.formulas.hacknetServers.hashGainRate(n.level, n.ramUsed = n.ramUsed * 2, n.ram = n.ram * 2, n.cores) / upgradeCost
		upgradeList.push({ "nodeNum": i, "uName": "Ram", "uCost": upgradeCost, "uScore": score })
		n.ram = n.ram / 2
		n.ramUsed = n.ramUsed / 2
		//cores
		upgradeCost = ns.hacknet.getCoreUpgradeCost(i, 1)
		score = ns.formulas.hacknetServers.hashGainRate(n.level, n.ramUsed, n.ram, n.cores++) / upgradeCost
		upgradeList.push({ "nodeNum": i, "uName": "Core", "uCost": upgradeCost, "uScore": score })

		n.cores--
	}
	return upgradeList;
}

export function getUpgradeChoice(ns, nodeNum, costLimit) {
	ns.disableLog('ALL')

	let n = ns.hacknet.getNodeStats(nodeNum);
	ns.print(n)
	let bestUpgrade = "";
	let bestUpgradeScore = 0;
	let upgradeCost = 1e15;
	let score = 0;
	//level
	upgradeCost = ns.hacknet.getLevelUpgradeCost(nodeNum, 1)
	if (upgradeCost < costLimit) {
		score = ns.formulas.hacknetServers.hashGainRate(n.level++, n.ramUsed, n.ram, n.cores) / upgradeCost
		ns.print("Level ", n.level, "Ram", n.ram, "Cores", n.cores)
		if (score > bestUpgradeScore) {
			bestUpgrade = "Level"
			bestUpgradeScore = score;
		}
		n.level--
	}
	//ram
	upgradeCost = ns.hacknet.getRamUpgradeCost(nodeNum, 1)
	if (upgradeCost < costLimit) {
		score = ns.formulas.hacknetServers.hashGainRate(n.level, n.ramUsed = n.ramUsed * 2, n.ram = n.ram * 2, n.cores) / upgradeCost
		ns.print("Level ", n.level, "Ram", n.ram, "Cores", n.cores)
		if (score > bestUpgradeScore) {
			bestUpgrade = "Ram"
			bestUpgradeScore = score;
		}
		n.ram = n.ram / 2
		n.ramUsed = n.ramUsed / 2
	}

	//core
	upgradeCost = ns.hacknet.getCoreUpgradeCost(nodeNum, 1)
	if (upgradeCost < costLimit) {
		score = ns.formulas.hacknetServers.hashGainRate(n.level, n.ramUsed, n.ram, n.cores++) / upgradeCost
		ns.print("Level ", n.level, "Ram", n.ram, "Cores", n.cores)
		if (score > bestUpgradeScore) {
			bestUpgrade = "Core"
			bestUpgradeScore = score;
		}
		n.cores--
	}
	return bestUpgrade;
}

export function upgradeServer(ns, nodeNum, upgradeType, costLimit = getAvailableMoney(ns)) {
	if (upgradeType === "Level") {
		if (ns.hacknet.getLevelUpgradeCost(nodeNum, 1) < costLimit) {
			sellHashesForMoney(ns, ns.hacknet.getLevelUpgradeCost(nodeNum, 1))
			return ns.hacknet.upgradeLevel(nodeNum, 1)
		}
	}
	if (upgradeType === "Ram") {
		if (ns.hacknet.getRamUpgradeCost(nodeNum, 1) < costLimit) {
			sellHashesForMoney(ns, ns.hacknet.getRamUpgradeCost(nodeNum, 1))
			return ns.hacknet.upgradeRam(nodeNum, 1)
		}
	}
	if (upgradeType === "Core") {
		if (ns.hacknet.getCoreUpgradeCost(nodeNum, 1) < costLimit) {
			sellHashesForMoney(ns, ns.hacknet.getCoreUpgradeCost(nodeNum, 1))
			return ns.hacknet.upgradeCore(nodeNum, 1)
		}
	}
	if (upgradeType === "Cache") {
		if (ns.hacknet.getLevelUpgradeCost(nodeNum, 1) < costLimit) {
			sellHashesForMoney(ns, ns.hacknet.getCacheUpgradeCost(nodeNum, 1))
			return ns.hacknet.upgradeCache(nodeNum, 1)
		}
	}
}

export function getTimeToRecoup(ns, nodeNum, upgradeType) {
	ns.disableLog('ALL')

	let n = ns.hacknet.getNodeStats(nodeNum);
	let timeToRecoupCost = -1;
	let upgradeCost = -1;
	let startHGR = -1
	let upgHGR = -1
	let change = -1
	let moneyPerSecond = -1

	if (upgradeType === "Level") {
		upgradeCost = ns.hacknet.getLevelUpgradeCost(nodeNum, 30)
		startHGR = ns.formulas.hacknetServers.hashGainRate(n.level, n.ramUsed, n.ram, n.cores)
		upgHGR = ns.formulas.hacknetServers.hashGainRate(n.level = n.level + 30, n.ramUsed, n.ram, n.cores)
		change = upgHGR - startHGR
		moneyPerSecond = change * (1000000 / ns.hacknet.hashCost("Sell for Money"))
		timeToRecoupCost = upgradeCost / moneyPerSecond
	}
	if (upgradeType === "Ram") {
		upgradeCost = ns.hacknet.getRamUpgradeCost(nodeNum, 1)
		startHGR = ns.formulas.hacknetServers.hashGainRate(n.level, n.ramUsed, n.ram, n.cores)
		upgHGR = ns.formulas.hacknetServers.hashGainRate(n.level, n.ramUsed, n.ram = n.ram * 2, n.cores)
		change = upgHGR - startHGR
		moneyPerSecond = change * (1000000 / ns.hacknet.hashCost("Sell for Money"))
		timeToRecoupCost = upgradeCost / moneyPerSecond
	}
	if (upgradeType === "Core") {
		upgradeCost = ns.hacknet.getCoreUpgradeCost(nodeNum, 1)
		startHGR = ns.formulas.hacknetServers.hashGainRate(n.level, n.ramUsed, n.ram, n.cores)
		upgHGR = ns.formulas.hacknetServers.hashGainRate(n.level, n.ramUsed, n.ram, n.cores++)
		change = upgHGR - startHGR
		moneyPerSecond = change * (1000000 / ns.hacknet.hashCost("Sell for Money"))
		timeToRecoupCost = upgradeCost / moneyPerSecond
	}

	return timeToRecoupCost
}

export function spendChoice(ns) {
	
}


export async function main(ns) {
	ns.print(getTimeToRecoup(ns, 8, "Level"))
	ns.print(getTimeToRecoup(ns, 8, "Ram"))
	ns.print(getTimeToRecoup(ns, 8, "Core"))
}