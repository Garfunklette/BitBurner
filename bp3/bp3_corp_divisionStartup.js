/** @param {NS} ns */
import * as hCorp from "bp3_helpers_corp.js"

export async function main(ns) {
	let divType = ns.args[0] || "Tobacco"
	await hCorp.divStartup(ns,divType);
}