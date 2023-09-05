/** @param {NS} ns */


export function getCrimeStatGain(ns, stat) {
	let crimeScores = [];
	for (let i of CRIMELIST) {
		let chance = ns.singularity.getCrimeChance(i)
		let stats = ns.singularity.getCrimeStats(i)
		let score = stats[stat] * chance / stats.time;
		crimeScores.push({ cName: i, cScore: score, cTime: stats.time })
	}
	crimeScores.sort((a, b) => b.cScore - a.cScore);
	return crimeScores
}

export function getBestCrime(ns, stat = "money") {
	let scores = getCrimeStatGain(ns, stat)
	scores = scores.filter(el => el.cTime < 120000)
	return scores[0].cName
}

export const CRIMELIST = [
	"Assassination",
	"Bond Forgery",
	"Deal Drugs",
	"Grand Theft Auto",
	"Heist",
	"Homicide",
	"Kidnap",
	"Larceny",
	"Mug",
	"Rob Store",
	"Shoplift",
	"Traffick Arms"
]
//import {getBestCrime} from "bp3_helpers_player.js"
export async function main(ns) {
	let stat = ns.args[0] || "money"
ns.tprint(getBestCrime(ns,stat)," ",stat)
}