/** @param {NS} ns */
export async function main(ns) {

	if (ns.getServerUsedRam("home") / ns.getServerMaxRam("home") > .5) {
		let cost = ns.singularity.getUpgradeHomeRamCost();
		if (ns.getServerMoneyAvailable("home") > ns.singularity.getUpgradeHomeRamCost()) {
			if (ns.singularity.upgradeHomeRam()) {
				ns.tprint("Upgraded home to " + ns.getServerMaxRam("home")+" for "+cost)
			}
		}
	}
}