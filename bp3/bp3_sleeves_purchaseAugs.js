/** @param {NS} ns */

function purchaseAllAugs(ns) {
	let numSleeves = ns.sleeve.getNumSleeves();
	for (let i = 0; i < numSleeves; i++) {
		if (ns.sleeve.getSleeve(i).shock === 0) {
			let sAugs = ns.sleeve.getSleevePurchasableAugs(i);
			for (let k of sAugs) {
				if (ns.getServerMoneyAvailable("home") > ns.sleeve.getSleeveAugmentationPrice(k.name))
					ns.sleeve.purchaseSleeveAug(i, k.name);
			}
		}
	}
}

export async function main(ns) {
	purchaseAllAugs(ns);


}