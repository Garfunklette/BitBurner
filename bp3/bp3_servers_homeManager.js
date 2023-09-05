/** @param {NS} ns */
export async function main(ns) {
	while (true) {
		if (ns.getServerUsedRam("home") / ns.getServerMaxRam("home") > .5) {
			if (ns.getServerMoneyAvailable("home") > ns.singularity.getUpgradeHomeRamCost())
				ns.singularity.upgradeHomeRam();
		}
		await ns.sleep(60000);
	}
}