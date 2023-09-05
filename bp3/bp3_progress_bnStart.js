/** @param {NS} ns */
export async function main(ns) {

	ns.singularity.universityCourse("Rothman University", "Algorithms");


	ns.exec("bp3_hacking_bN00dles.js", "home");



	while (ns.getServerMoneyAvailable("home") < 250000) {
		ns.exec("bp3_progress_upgradeHome.js", "home")
		ns.exec("bp3_progress_tor.js", "home");
		ns.exec("bp3_servers_rootAll.js", "home");
		await ns.sleep(10000);
	}



}