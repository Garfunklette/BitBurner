/** @param {NS} ns */
export async function main(ns) {

	while (true) {
		ns.exec("bp3_servers_upgradeHome.js", "home");
		ns.exec("bp3_progress_tor.js", "home");
		ns.exec("bp3_hacking_rootAll.js", "home");
		if (ns.getHackingLevel() > 10) {
			ns.exec("bp3_hacking_allInOne.js", "home", { preventDuplicates: true },true);
		} else {
			ns.exec("bp3_player_university.js", "home", { preventDuplicates: true }, 59)
		}
		if (ns.getServerMoneyAvailable("home") > 26e6) {
			ns.exec("bp3_pservers_mgr.js", "home", { preventDuplicates: true });
		}
		if (ns.getServerMoneyAvailable("home") > 50e6 && ns.stock.has4SDataTIXAPI()) {
			ns.exec("bp3_stock_start.js", "home", { preventDuplicates: true });
		}
		if (ns.getServerMoneyAvailable("home") > 40e9 && !ns.stock.has4SDataTIXAPI()) {
			ns.exec("bp3_stock_start.js", "home", { preventDuplicates: true });
		}
		if (ns.getServerMoneyAvailable("home") > 150e9 && !ns.corporation.hasCorporation()) {
			ns.exec("bp3_corp_start.js", "home", { preventDuplicates: true });
		}
		if(ns.getHackingLevel()>2500) {
			ns.exec("bp3_player_manager.js","home",{preventDuplicates:true})
		}
		if(ns.singularity.getOwnedAugmentations().indexOf("The Red Pill")>-1 && ns.getHackingLevel()>6000) {
			ns.exec("bp3_progress_endBitnode.js")
		}
		await ns.sleep(60000)
	}

}