/** @param {NS} ns */
import * as hCorp from "bp3_helpers_corp.js"

export async function main(ns) {
	while(true) {
	hCorp.corpInvest1(ns);
	let divName = "FishFarm"
	await hCorp.bpmForAg(ns, divName, hCorp.AgProdMat2);
	await ns.sleep(60000)
	}
}