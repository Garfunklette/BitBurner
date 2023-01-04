/** @param {NS} ns */
//ultimate goal: hack the world
//__STEPS__
//gain access to factions / gangs / 
//get Daedalus req hacking skill through augs and weakening n00dles
//get access to the Red Pill faction Daedalus
//get enough rep to buy the red pill
//get enough skill to hack the world
//hack the world

//loop check
//

import * as hp from "bp_helpers_purchase.js"

function ramCheck(ns, host) {
	let freeRamPercent = (ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getServerMaxRam(host);
	if (freeRamPercent < 0.5) {
		hp.canBuyCheck(ns,ns.singularity.getUpgradeHomeRamCost())
		if (hp.canBuyCheck(ns,ns.singularity.getUpgradeHomeRamCost())===false ) {
			ns.exec("bp_sing_scoreCrimes.js", "home", 1, "money", true);
		} else {
			ns.singularity.upgradeHomeRam();
		}
	}
}

function totalRamCheck(ns) {
	let pList = ns.getPurchasedServers();
	let used = 0;
	let max = 0;
	let free = 0;
	for (let p of pList) {
		max = max + ns.getServerMaxRam(p);
		used = used + ns.getServerUsedRam(p);
	}
	free = max - used;
	if (free / max < .5) {
		ns.exec("bp_maxPServer.js", "home", 1, "buy", 1, false);
	}
}

function pbCheck(ns) {
	let exes = ns.ls("home", ".exe");
	let portBusters = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"]
	for (let p of portBusters) {
		if (exes.indexOf(p) < 0 && hp.canBuyCheck(ns,250000000)) {
			ns.exec("bp_sing_tor.js", "home");
		}
	}
}

function updateStatus(ns, status) {
	let hLevel = ns.getHackingLevel();
	if (ns.singularity.getOwnedAugmentations().indexOf("The Red Pill") > -1) {
		if (hLevel < ns.getServerRequiredHackingLevel("w0r1d_d43m0n")) {
			status = "Need hack level " + ns.getServerRequiredHackingLevel("w0r1d_d43m0n")
			return status
		} else {
			status = "Ready to Hack The World";
			return status
		}
	}
	if (hLevel < 2500) {
		status = "get Faction Augs"
	} else {
		if (ns.getPlayer().factions.indexOf("Daedalus") < -1) {
			if (hp.canBuyCheck(ns,100000000000)===false) {
				status = "get $100b";
			} else {
				status = "Join Daedalus"
			}
		}
	}
	return status
}

export async function main(ns) {
	let hLevel = ns.getHackingLevel();
	let player = ns.getPlayer();
	let status = "starting";
	while (true) {
		ramCheck(ns, "home");

		hLevel = ns.getHackingLevel();
		player = ns.getPlayer();

		if (hLevel < 58) {
			ns.exec("bp_sing_uni.js", "home", 1, 59);
		}
		while (player.tor === false) {
			if (player.tor === false) {
				ns.exec("bp_sing_tor.js", "home");
			}
			if (hp.canBuyCheck(ns, 250000000)) {
				ns.exec("bp_sing_scoreCrimes.js", "home", 1, "money", true, 250000000);
			}
			await ns.sleep(60000);
			hLevel = ns.getHackingLevel();
			player = ns.getPlayer();
		}

		pbCheck(ns);

		if (hp.canBuyCheck(ns,250000000)) {
			totalRamCheck(ns);
		}

		if (hp.canBuyCheck(ns,30000000000)) {
			if (player.has4SDataTixApi === true) {
				ns.exec("hm_stockMaster.js", "home");
			}
			else {
				ns.exec("bp_stock_4STixBuyAndStart.js", "home");
			}
		}

		if (hLevel > 2600) {
			ns.exec("bp_weakenN00dlesDist.js", "home");
			ns.exec("bp_sleeve_redPill.js","home")
			ns.singularity.joinFaction("Daedalus");
			await ns.sleep(2000);
			ns.exec("bp_sing_factionWork.js", "home", 1, "Daedalus", 480000)
		}
		ns.exec("bp_rootAll.js", "home");
		status = updateStatus(ns,status)
		ns.print(status);
		await ns.sleep(60000);
	}
}
