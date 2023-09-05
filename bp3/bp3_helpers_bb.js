/** @param {NS} ns */

export function investAllHashesBB(ns) {
	let noHashes = ns.hacknet.numHashes();
	const bbUpgrades = ["Exchange for Bladeburner Rank", "Exchange for Bladeburner SP"]
	let minUpCost = Math.min(ns.hacknet.hashCost(bbUpgrades[0]), ns.hacknet.hashCost(bbUpgrades[1]))
	let counter = 100
	while (noHashes > minUpCost) {
		noHashes = ns.hacknet.numHashes();
		for (let i of bbUpgrades) {
			if (noHashes > ns.hacknet.hashCost(i)) {
				ns.hacknet.spendHashes(i)
				noHashes = ns.hacknet.numHashes();
			}
		}
		counter--
		if (counter < 1) {
			break
		}
		noHashes = ns.hacknet.numHashes();
		minUpCost = Math.min(ns.hacknet.hashCost(bbUpgrades[0]), ns.hacknet.hashCost(bbUpgrades[1]))
	}
}

export function bbRestart(ns) {
	if (ns.hacknet.numHashes() >= 250) {
		investAllHashesBB(ns);
	}
	ns.killall("home", true);
	ns.exec("bp3_augs_purchase.js", "home")
	ns.exec("bp3_sleeves_purchaseAugs.js", "home")
	ns.singularity.installAugmentations("bp3_bb_manager.js");
}

export function getBBAugs(ns) {
	let bbAugs = ns.singularity.getAugmentationsFromFaction("Bladeburners");
	bbAugs = bbAugs.filter(el => !(ns.singularity.getOwnedAugmentations(true).includes(el)));
	bbAugs.sort((a, b) => ns.singularity.getAugmentationPrice(b) - ns.singularity.getAugmentationPrice(a))
	bbAugs = bbAugs.filter(el => ns.singularity.getAugmentationRepReq(el) < ns.singularity.getFactionRep("Bladeburners"));
	let purchasedcount = 0;
	for (let i of bbAugs) {
		if (ns.singularity.getAugmentationPrice(i) < ns.getServerMoneyAvailable("home")) {
			ns.singularity.purchaseAugmentation("Bladeburners", i)
			purchasedcount++;
		}
	}
	if (purchasedcount > 0) {
		bbRestart(ns);
	}
}

export function actionAvailabilityCheck(ns, actionType, actionName) {
	let remaining = ns.bladeburner.getActionCountRemaining(actionType, actionName)
	let estSuccess = ns.bladeburner.getActionEstimatedSuccessChance(actionType, actionName)
	let averageChance = (estSuccess[0] + estSuccess[1]) / 2
	let remCheck = 10;
	let chanceCheck = 0.8
	if (actionType === "BlackOps") {
		if (ns.bladeburner.getBlackOpRank(actionName) > ns.bladeburner.getRank()) {
			return false;
		} else {
			remCheck = 0
			chanceCheck = 0.25
		}
	}
	if (remaining > remCheck && averageChance > chanceCheck) {
		return true;
	}
	return false;
}

export function getNextBlackOps(ns) {
	const BlackOps = ns.bladeburner.getBlackOpNames();
	let availBlackOps = BlackOps.filter(el => ns.bladeburner.getActionCountRemaining("BlackOps", el) > 0);
	availBlackOps = availBlackOps.filter(el => ns.bladeburner.getBlackOpRank(el) < ns.bladeburner.getRank())
	availBlackOps.sort((a, b) => ns.bladeburner.getBlackOpRank(a) - ns.bladeburner.getBlackOpRank(b))
	if (availBlackOps.length > 0) {
		return availBlackOps[0]
	}
}

export async function doNextBlackOps(ns) {
	let blackOp = getNextBlackOps(ns)
	if (blackOp !== undefined) {
		let hasBonusSleepMulti = (ns.bladeburner.getBonusTime() > 0 ? 0.2 : 1)
		hasBonusSleepMulti = (ns.bladeburner.getBonusTime() > 0 ? 0.2 : 1)
		let sleepTime = 1000 * hasBonusSleepMulti;

		if (ns.bladeburner.getCurrentAction() !== blackOp) {
			ns.bladeburner.startAction("BlackOps", blackOp)
			sleepTime = ns.bladeburner.getActionTime("BlackOps", blackOp) * hasBonusSleepMulti;
			await ns.sleep(sleepTime)
		}
		await ns.sleep(5000)
		blackOp = getNextBlackOps(ns)
	}
}

export function getAvailableActions(ns) {
	const OperationActions = ns.bladeburner.getOperationNames();
	OperationActions.splice(OperationActions.indexOf("Raid"), 1)

	const ContractActions = ns.bladeburner.getContractNames();
	const BlackOps = ns.bladeburner.getBlackOpNames();

	ns.print("getAvailableActions");
	let availableActions = [];
	for (let i of BlackOps) {
		let type = "BlackOps"
		let name = i;
		if (actionAvailabilityCheck(ns, type, name)) {
			let repGain = getRepGainPerSecond(ns, type, name)
			availableActions.push([type, name, repGain]);
		}
	}
	for (let j of ContractActions) {
		let type = "Contract"
		let name = j
		if (actionAvailabilityCheck(ns, type, name)) {
			let repGain = getRepGainPerSecond(ns, type, name)
			availableActions.push([type, name, repGain]);
		}
	}
	for (let k of OperationActions) {
		let type = "Operation"
		let name = k;
		if (actionAvailabilityCheck(ns, type, name)) {
			let repGain = getRepGainPerSecond(ns, type, name)
			availableActions.push([type, name, repGain]);
		}
	}
	//	ns.print(availableActions)
	return availableActions;
}

export function doBestAction(ns) {
	ns.print("do best action")
	let avail = getAvailableActions(ns)
	if (avail.length > 0) {
		avail.sort((a, b) => b[2] - a[2]);

		let action = avail[0];
		let current = ns.bladeburner.getCurrentAction();
		if (!(action[0] === current.type && action[1] === current.name)) {
			ns.print("starting action " + action[1])
			ns.bladeburner.startAction(action[0], action[1]);
		} else {
			ns.print("performing action " + current.name)
		}
	}
}

export function getRepGainPerSecond(ns, aType, aName) {
	ns.print("getRepGainPerSecond " + aType + aName)
	let successChance = ns.bladeburner.getActionEstimatedSuccessChance(aType, aName)
	let avgSuccess = (successChance[0] + successChance[1]) / 2
	let repGain = ns.bladeburner.getActionRepGain(aType, aName)
	let actionTime = ns.bladeburner.getActionTime(aType, aName);
	let repReturn = avgSuccess * repGain / actionTime
	return repReturn;
}

export function staminaCheck(ns, checkValue = 0.5) {
	ns.print("stamina check");
	let stam = ns.bladeburner.getStamina();
	if (stam[0] / stam[1] > checkValue) {
		return true
	}
	return false;
}

export function recuperate(ns) {
	ns.bladeburner.startAction("General", "Hyperbolic Regeneration Chamber")
}

export function bestSkillUpgrade(ns) {
	let points = ns.bladeburner.getSkillPoints();
	const SkillList = ns.bladeburner.getSkillNames();
	let minUpCost = ns.bladeburner.getSkillUpgradeCost(SkillList[0]);
	let counter = 200;
	while (points > minUpCost) {
		for (let i of SkillList) {
			if (ns.bladeburner.getSkillUpgradeCost(i) < points) {
				ns.bladeburner.upgradeSkill(i, 1)
				points = ns.bladeburner.getSkillPoints();
				let upCost = ns.bladeburner.getSkillUpgradeCost(i);
				if (upCost < minUpCost) {
					minUpCost = upCost;
				}
			}
		}
		counter--;
		if (counter < 1) {
			break;
		}
		points = ns.bladeburner.getSkillPoints();
	}
}



/*
const GeneralActions = [
	"Training",
	"Field Analysis",
	"Recruitment",
	"Diplomacy",
	"Hyperbolic Regeneration Chamber",
];
const OperationActions = ns.bladeburner.getOperationNames();
const ContractActions = ns.bladeburner.getContractNames();
const BlackOps = ns.bladeburner.getBlackOpNames();
*/




export async function main(ns) {

}