/** @param {NS} ns */
export async function main(ns) {

	let target = ns.args[0];

	let files = [
		"bp3_corp_manager.js",
		"bp3_helpers_manager.js",
		"bp3_helpers_augs.js",
		"bp3_helpers_factions.js",
		"bp3_data_factions.js",
		"bp3_data_servers.js",
		"bp3_helpers_terminal.js"
	]
	ns.scp(files, target, "home")

}