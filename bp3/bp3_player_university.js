/** @param {NS} ns */
export async function main(ns) {
	let goal = ns.args[0] || 59;
	while (true) {
		ns.singularity.universityCourse("Rothman University", "Algorithms",false);


		await ns.sleep(1000)
		if (ns.getHackingLevel() > goal) {
			break;
		}
	}
	ns.tprint("Hacking level goal met ") + goal
	ns.spawn("bp3_player_manager.js")
}