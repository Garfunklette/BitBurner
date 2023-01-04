/** @param {NS} ns */
export function getCrimeInfo(ns, crimesList) {
	let crimesInfo = [];
	for (let crime of crimesList) {
		let cStats = ns.singularity.getCrimeStats(crime);
		//	ns.print(cStats);
		let chance = ns.singularity.getCrimeChance(crime);
		crimesInfo.push({
			cName: crime,
			cTime: cStats.time,
			cChance: chance,
			cMPS: cStats.money / (cStats.time + 500) * chance * 1000,
			cStrExpPS: cStats.strength_exp / (cStats.time + 500) * chance * 1000,
			cDefExpPS: cStats.defense_exp / (cStats.time + 500) * chance * 1000,
			cDexExpPS: cStats.dexterity_exp / (cStats.time + 500) * chance * 1000,
			cAgiExpPS: cStats.agility_exp / (cStats.time + 500) * chance * 1000,
			cChaExpPS: cStats.charisma_exp / (cStats.time + 500) * chance * 1000
		})
	}
	return crimesInfo
}

export async function main(ns) {
	const crimesList = ["Shoplift", "Rob Store", "Mug", "Larceny", "Deal Drugs", "Bond Forgery", "Traffick illegal Arms", "Homicide", "Grand theft Auto", "Kidnap and Ransom", "Assassinate", "Heist"];
	let stat = ns.args[0] || "money";
	stat = stat.toLowerCase();
	let crimesInfo = getCrimeInfo(ns, crimesList);
	let doCrime = ns.args[1] || false;
	let goal = ns.args[2] || 250000000;


	switch (stat) {
		case "money":
			crimesInfo.sort((a, b) => b.cMPS - a.cMPS);
			break
		case "strength":
			crimesInfo.sort((a, b) => b.cStrExpPS - a.cStrExpPS);
			break
		case "defense":
			crimesInfo.sort((a, b) => b.cDefExpPS - a.cDefExpPS);
			break
		case "dexterity":
			crimesInfo.sort((a, b) => b.cDexExpPS - a.cDexExpPS);
			break
		case "agility":
			crimesInfo.sort((a, b) => b.cAgiExpPS - a.cAgiExpPS);
			break
		case "charisma":
			crimesInfo.sort((a, b) => b.cChaExpPS - a.cChaExpPS);
			break
		case "all":
			ns.print("Money" + crimesInfo.sort((a, b) => b.cMPS - a.cMPS)[0].cName);
			ns.print("Strength" + crimesInfo.sort((a, b) => b.cStrExpPS - a.cStrExpPS)[0].cName);
			ns.print("Defense" + crimesInfo.sort((a, b) => b.cDefExpPS - a.cDefExpPS)[0].cName);
			ns.print("Dexterity" + crimesInfo.sort((a, b) => b.cDexExpPS - a.cDexExpPS)[0].cName);
			ns.print("Agility" + crimesInfo.sort((a, b) => b.cAgiExpPS - a.cAgiExpPS)[0].cName);
			ns.print("Charisma" + crimesInfo.sort((a, b) => b.cChaExpPS - a.cChaExpPS)[0].cName);
			break
	}

	ns.print(stat, crimesInfo[0]);
	if(doCrime===true) {
		ns.exec("bp_sing_doCrimes.js","home",1,crimesInfo[0].cName,goal);
	}
	ns.print(crimesInfo[0].cName);
}
