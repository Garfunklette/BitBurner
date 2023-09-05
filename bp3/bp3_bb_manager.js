/** @param {NS} ns */
import * as hBB from "bp3_helpers_bb.js"
import * as hSleeves from "bp3_helpers_sleeves.js"

async function bbCheck(ns) {
	if(!ns.bladeburner.inBladeburner()) {
		await trainToX(ns,100);
		ns.bladeburner.joinBladeburnerDivision()
	}
}

function assignSleeves(ns, i) {
	if (Jobs[i].aAction === "Take on contracts") {
		if (ns.bladeburner.getActionCountRemaining("contracts", Jobs[i].aDetail) > 10) {
			ns.sleeve.setToBladeburnerAction(i, Jobs[i].aAction, Jobs[i].aDetail)
		} else {
			ns.sleeve.setToBladeburnerAction(i, "Infiltrate Synthoids");
		}
	} else {
		ns.sleeve.setToBladeburnerAction(i, Jobs[i].aAction);
	}
}

const Jobs = [
	{ aAction: "Field Analysis", aQty: 1 },
	{ aAction: "Diplomacy", aQty: 1 },
	{ aAction: "Infiltrate Synthoids", aQty: 1 },
	{ aAction: "Take on contracts", aDetail: "Tracking", aQty: 0 },
	{ aAction: "Take on contracts", aDetail: "Bounty Hunter", aQty: 0 },
	{ aAction: "Take on contracts", aDetail: "Retirement", aQty: 0 },
]

function assignSleevesBB(ns) {
	let numSleeves = ns.sleeve.getNumSleeves();
		for (let i = 0; i < numSleeves; i++) {
			if (hSleeves.checkShock(ns, i, 10)) {
				assignSleeves(ns, i);
			} else {
				ns.sleeve.setToShockRecovery(i);
			}
		} 
}

async function trainToX(ns,goal=30) {
	let player = ns.getPlayer();
	let pSkills = player.skills;
	let combatSkills = ["strength", "defense", "dexterity", "agility"]
	let min = 0;
	while (min < goal) {
		player = ns.getPlayer();
		pSkills = player.skills;
		let min = goal;
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
		} else {
			return;
		}
		pSkills = ns.getPlayer().skills;
		ns.print(minStat + " " + pSkills[minStat] + "/" + goal);

		await ns.sleep(5000);
		ns.clearLog();
		ns.singularity.stopAction();
	}
}


export async function main(ns) {
	await trainToX(ns,75);
	await bbCheck(ns)
	hBB.getBBAugs(ns)
	hBB.bestSkillUpgrade(ns)
	assignSleevesBB(ns);
	
	ns.print(hBB.staminaCheck(ns))
	let sleepTime = 10000;
	while (true) {
		hBB.getBBAugs(ns)
		hBB.bestSkillUpgrade(ns)
		assignSleevesBB(ns);
		if (hBB.staminaCheck(ns, 0.6)) {
			let nextBlackOps = hBB.getNextBlackOps(ns)
			ns.print(nextBlackOps);
			if (nextBlackOps !== undefined) {
				await hBB.doNextBlackOps(ns)
			} else {
				hBB.doBestAction(ns)
				sleepTime = ns.bladeburner.getActionTime(ns.bladeburner.getCurrentAction().type, ns.bladeburner.getCurrentAction().name) * 1.1;
			}
		} else {
			if (hBB.staminaCheck(ns, 0.5)) {
				hBB.recuperate(ns)
				sleepTime = 65000;
			} else {
				ns.bladeburner.startAction("General", "Field Analysis")
				sleepTime = 30000
			}
		}
		
		await ns.sleep(sleepTime);
	}
}