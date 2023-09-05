/** @param {NS} ns */
import * as hCorp from "bp3_helpers_corp.js"

export async function main(ns) {
await hCorp.corpStartup(ns);
let divName = "FishFarm"
	await hCorp.bpmForAg(ns, divName,hCorp.AgProdMat1);
}