/** @param {NS} ns */
export async function main(ns) {
	let company = ns.args[0];
	let goal = ns.args[1] || 400000;
	while (true) {
		if (ns.singularity.getCompanyRep(company) > goal) {
			break;
		}
		ns.singularity.workForCompany(company, false);

		await ns.sleep(60000)
	}
	ns.tprint("Achieved company " + company + " work goal of " + goal)
	ns.exec("bp3_player_manager.js","home");
}