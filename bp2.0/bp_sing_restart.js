/** @param {NS} ns */
export async function main(ns) {

	let player = ns.getPlayer();

	ns.exec("bp_sing_progress.js", "home");

	await ns.sleep(10000);

	if (ns.sleeve.getNumSleeves() > 0) {
		ns.exec("bp_sleeve_task.js", "home");
		await ns.sleep(10000);
	}

	if (ns.gang.inGang() === true) {
		ns.exec("bp_gang_manager.js", "home");
		await ns.sleep(10000);
	}

	if (ns.stock.has4SDataTIXAPI() === true) {
		ns.exec("hm_stockMaster.js", "home")
		await ns.sleep(10000);
	}

	if (player.hasCorporation === true) {
		ns.exec("bp_corp_manager.js","home")
		await ns.sleep(10000);
	}

	ns.exec("bp_hacknet_upgrade.js","home",1,"hash 1000");

	ns.exec("bp_sing_playerManager.js","home",1,"hack","rep");
}
