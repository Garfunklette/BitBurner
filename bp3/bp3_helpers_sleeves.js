/** @param {NS} ns */

export function checkShock(ns, sleeveNo, shockPerc = 95) {
	let sleevePerson = ns.sleeve.getSleeve(sleeveNo);
	if (sleevePerson.shock < shockPerc) {
		return true;
	} 
	return false;
}

export function chooseTask(ns, sleeveNo) {
	let sleevePerson = ns.sleeve.getSleeve(sleeveNo);
	if (sleevePerson.shock > 95) {
		ns.sleeve.setToShockRecovery(sleeveNo);
		return;
	}
	ns.sleeve.setToCommitCrime(sleeveNo, "Mug")
}

export function setAllSleevesToMug(ns) {
	let numSleeves = ns.sleeve.getNumSleeves()
	for (let i = 0; i < numSleeves; i++) {
		let info = ns.sleeve.getSleeve(i)

		if (info.shock < 97) {
			ns.sleeve.setToCommitCrime(i, "Mug")
		}
	}
}

export async function main(ns) {

}