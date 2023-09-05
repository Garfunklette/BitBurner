/** @param {NS} ns */
export async function main(ns) {
	let factions = ns.getPlayer().factions
	factions.sort((a,b)=>ns.singularity.getFactionFavor(b)-ns.singularity.getFactionFavor(a))
	
	if (ns.corporation.hasCorporation()) {
		ns.corporation.bribe(factions[0], ns.getServerMoneyAvailable("home") / 10)
	}
	factions.sort((a,b)=>ns.singularity.getFactionRep(b)-ns.singularity.getFactionRep(a))

	let nfgCost = ns.singularity.getAugmentationPrice("NeuroFlux Governor")
	let money = ns.getServerMoneyAvailable("home")
	while (money > nfgCost) {
		ns.singularity.purchaseAugmentation(factions[0], "NeuroFlux Governor")
		await ns.sleep(1000);
		nfgCost = ns.singularity.getAugmentationPrice("NeuroFlux Governor")
		money = ns.getServerMoneyAvailable("home")
	}
}