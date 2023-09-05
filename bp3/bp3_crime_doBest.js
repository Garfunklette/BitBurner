/** @param {NS} ns */
import {getCrimeScores} from "bp3_helpers_player.js"
export async function main(ns) {
ns.print(getCrimeScores(ns));
}