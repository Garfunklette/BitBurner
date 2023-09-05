/** @param {NS} ns */
export async function main(ns) {
	let crime = ns.args[0] || "Mug";
	let stat = ns.args[1] || "Money"

	let goal = ns.args[2] || 1e6;
	let sleepTime = ns.args[3] || ns.singularity.getCrimeStats(crime).time+1000 || 60000;
	let player = ns.getPlayer();
	while (true) {
		ns.singularity.commitCrime(crime,false)


		await ns.sleep(sleepTime)
		player = ns.getPlayer();


		if (stat === "Money") {
			if (ns.getServerMoneyAvailable("home") > goal) {
				break
			}
		} else {
			if (player[stat] > goal) {
				break;
			}
		}
		ns.print("Stat / goal "+stat + " / "+goal)
	}
	ns.tprint("Stat goal met ") + goal + "for goal " + stat
}