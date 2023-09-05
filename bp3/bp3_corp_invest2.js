/** @param {NS} ns */
import * as hCorp from "bp3_helpers_corp.js"

export async function main(ns) {
	hCorp.corpInvest2(ns);
	let divName = "FishFarm"
	await hCorp.bpmForAg(ns, divName, hCorp.AgProdMat3);
}