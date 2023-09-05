/** @param {NS} ns */
import { getBestWorkType, WorkTypes } from "bp3_helpers_factions.js"

function getAvailWorkTypes(ns, faction) {
	let availWorkTypes = []
	for (let i of WorkTypes) {
		if (ns.singularity.workForFaction(faction, i, false)) {
			availWorkTypes.push(i)
		}
	}
	return availWorkTypes;
}

export async function main(ns) {
	let faction = ns.args[0];
	let workType = ns.args[1];
	let goal = ns.args[2];
	let factionRep = ns.singularity.getFactionRep(faction);
	while (factionRep < goal) {
		let availWorkTypes = getAvailWorkTypes(ns, faction);
		let current = ns.singularity.getCurrentWork()
		if (current === null) {

			ns.singularity.workForFaction(faction, getBestWorkType(ns, faction, ns.getPlayer(), availWorkTypes), false)
		} else if (current.type === "FACTION" && current.factionName === faction && current.factionWorkType === workType) {
		} else if (current.type === "CRIME") {
		} else {
			availWorkTypes = getAvailWorkTypes(ns, faction);
			ns.print("p_wfF bestWorkType ",getBestWorkType(ns, faction, ns.getPlayer(), availWorkTypes))
			let bestWorkType = getBestWorkType(ns, faction, ns.getPlayer(), );
			ns.singularity.workForFaction(faction, bestWorkType, false)
		}
		await ns.sleep(60000);
		factionRep = ns.singularity.getFactionRep(faction);
		ns.print("Faction Rep: " + ns.formatNumber(factionRep, "0.00a"));
	}
	ns.tprint("Goal of " + ns.formatNumber(goal, "0.00a") + " reached for " + faction)
	ns.exec("bp3_player_manager.js", "home");
}