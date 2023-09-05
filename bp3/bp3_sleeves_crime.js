/** @param {NS} ns */
export async function main(ns) {
let numSleeves = ns.sleeve.getNumSleeves();
for(let i = 0; i<numSleeves;i++) {
	ns.sleeve.setToCommitCrime(i,"Mug")
}
}