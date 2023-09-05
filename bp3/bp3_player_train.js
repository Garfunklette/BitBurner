/** @param {NS} ns */
export async function main(ns) {

	let goal = ns.args[0] || 30;
	let tiers = [30, 75, 200, 300]
	let player = ns.getPlayer();
	let pSkills = player.skills;
	let combatSkills = ["strength", "defense", "dexterity", "agility"]
	let min = 0;
	while (min < goal) {
		player = ns.getPlayer();
		pSkills = player.skills;
		let min = 300;
		let minStat = "strength";
		for (let h of combatSkills) {
			if (pSkills[h] < min) {
				min = pSkills[h]
				minStat = h;
			}
		}
		if (min < goal) {
			if (player.location !== "Sector-12")
				ns.singularity.travelToCity("Sector-12")
			ns.singularity.gymWorkout("Powerhouse Gym", minStat, false);
		}
		pSkills = ns.getPlayer().skills;
		ns.print(minStat + " " + pSkills[minStat] + "/" + goal);

		await ns.sleep(5000);
		ns.clearLog();
		ns.singularity.stopAction();
	}
	
	ns.tprint("Workout to " + goal + " complete")
}