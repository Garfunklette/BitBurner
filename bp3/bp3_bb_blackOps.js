/** @param {NS} ns */
import * as hBB from "bp3_helpers_bb.js";



export async function main(ns) {
	let blackOp = hBB.getNextBlackOps(ns)
	let hasBonusSleepMulti = (ns.bladeburner.getBonusTime() > 0 ? 0.2 : 1)
	while (true) {
	hasBonusSleepMulti = (ns.bladeburner.getBonusTime() > 0 ? 0.2 : 1)
		let sleepTime = 1000*hasBonusSleepMulti;
		
		if (ns.bladeburner.getCurrentAction() !== blackOp) {
			ns.bladeburner.startAction("BlackOps", blackOp)
			sleepTime = ns.bladeburner.getActionTime("BlackOps", blackOp)*hasBonusSleepMulti;
			await ns.sleep(sleepTime)
		}
		await ns.sleep(5000)
		blackOp = hBB.getNextBlackOps(ns)
		if(blackOp === undefined) {
			ns.exec("bp3_bb_manager.js","home",{preventDuplicates:true,threads:1})
		}
	}
}