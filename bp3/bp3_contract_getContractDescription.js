/** @param {NS} ns */
import * as hServers from "bp3_helpers_servers.js";

export async function main(ns) {
let contract = ns.args[0]
let target = ns.args[1]
ns.print(ns.codingcontract.getDescription(contract,target));
}