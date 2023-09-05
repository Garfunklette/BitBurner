/** @param {NS} ns */

import * as hSleeves from "bp3_helpers_sleeves.js"

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


export async function main(ns) {

	while (true) {
		let numSleeves = ns.sleeve.getNumSleeves();
		for (let i = 0; i < numSleeves; i++) {
			if (hSleeves.checkShock(ns, i, 10)) {
				assignSleeves(ns, i);
			} else {
				ns.sleeve.setToShockRecovery(i);
			}
		} 
		await ns.sleep(60000);
	}

}