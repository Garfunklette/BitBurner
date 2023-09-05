/** @param {NS} ns */
export async function main(ns) {
	if (ns.getServerMaxRam("home") - ns.getServerUsedRam("home") > ns.getScriptRam("bp3_progress_manager.js")) {
		ns.exec("bp3_progress_manager.js", "home")
	} else {
		ns.exec("bp3_hacking_loop.js", "home",{preventDuplicates:true},"n00dles")
	}
	ns.exec("bp3_hacknet_manager.js","home",{preventDuplicates:true})

	if (ns.getServerMaxRam("home") - ns.getServerUsedRam("home") > ns.getScriptRam("i3_customStats.js")*10) {
		ns.exec("i3_customStats.js", "home",{preventDuplicates:true})
	}
	if (ns.corporation.hasCorporation()) {
		ns.exec("bp3_corp_manager.js","home",{preventDuplicates:true})
	}

}