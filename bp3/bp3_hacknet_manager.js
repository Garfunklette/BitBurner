/** @param {NS} ns */

import * as hHacknet from "bp3_helpers_hacknet.js"

export async function main(ns) {

	ns.disableLog('sleep');
	ns.disableLog('getServerMoneyAvailable')
	let counter = 0;
	let noServers = ns.hacknet.numNodes();
	while(noServers === 0) {
		if (ns.getServerMoneyAvailable("home") / 100 > ns.hacknet.getPurchaseNodeCost()) {
			ns.hacknet.purchaseNode();
		}
		noServers = ns.hacknet.numNodes();
		await ns.sleep(10000);
	}

	while (true) {
		ns.print(counter)
		hHacknet.cacheCheckAndUpgrade(ns);
		hHacknet.sellAtOverCapacity(ns)
		if (ns.getServerMoneyAvailable("home") / 100 > ns.hacknet.getPurchaseNodeCost()) {
			ns.hacknet.purchaseNode();
		}
	
		let upgradeList = hHacknet.getAllUpgradeChoices(ns)
		upgradeList = upgradeList.filter(el => hHacknet.getTimeToRecoup(ns, el.nodeNum, el.uName) < 10800 || el.uCost < ns.getServerMoneyAvailable("home") / 100)
		if (counter > 30 && upgradeList.length > 0) {
			hHacknet.sellAllHashesForMoney(ns)

			upgradeList = hHacknet.getAllUpgradeChoices(ns)
			//	upgradeList = upgradeList.filter(el => el.uCost < hHacknet.getBankRoll(ns, 80));
			upgradeList = upgradeList.filter(el => hHacknet.getTimeToRecoup(ns, el.nodeNum, el.uName) < 10800 || el.uCost < ns.getServerMoneyAvailable("home") / 100)
			let countdown = upgradeList.length;
			let check = 1000
			while (countdown > 0) {

				upgradeList.sort((a, b) => b.uScore - a.uScore)
				ns.print(upgradeList[0])
				if (hHacknet.upgradeServer(ns, upgradeList[0].nodeNum, upgradeList[0].uName)) {
					counter = 0;
					upgradeList = hHacknet.getAllUpgradeChoices(ns);
					upgradeList = upgradeList.filter(el => hHacknet.getTimeToRecoup(ns, el.nodeNum, el.uName) < 10800 || el.uCost < ns.getServerMoneyAvailable("home") / 100)

					//	upgradeList = upgradeList.filter(el => el.uCost < hHacknet.getBankRoll(ns, 80));
					upgradeList.sort((a, b) => b.uScore - a.uScore)
				}
				check--;
				if (check < 1) {
					break;
				}
				countdown = upgradeList.length;
			}
		}
		ns.print(upgradeList)
		/*let noNodes = ns.hacknet.numNodes();
			for (let i = 0; i < noNodes; i++) {
				let costLimit = Math.floor(hHacknet.getBankRoll(ns,80)/noNodes);
			//	ns.print(i, hHacknet.getUpgradeChoice(ns, i))
				hHacknet.upgradeServer(ns, i, hHacknet.getUpgradeChoice(ns, i,costLimit))
			}*/
		counter++;
		await ns.sleep(1000);
		ns.clearLog();
	}

}