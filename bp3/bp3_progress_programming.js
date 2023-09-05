/** @param {NS} ns */

function hasProgram(ns, program) {
	let exes = ns.ls("home", ".exe");
	if (exes.indexOf(program) < 0) {
		return false
	}
	return true;
}

export async function main(ns) {
	let programs = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"]
	let programHackLevels = [59, 300, 400, 500, 714]
	for (let i of programs) {
		let program = i;
		let programReqHackingGoal = programHackLevels[programs.indexOf(program)];
		let hProgram = hasProgram(ns, program)

		let lProgram = program.toLowerCase();
		while (hProgram === false) {
			if (hasProgram(ns, lProgram) === false && ns.getHackingLevel() > programReqHackingGoal) {
				if (ns.hasTorRouter() === false) {
					if (ns.getServerMoneyAvailable("home") > 200000) {
						ns.singularity.purchaseTor();
					}
				}

				if (ns.singularity.getDarkwebProgramCost(lProgram) < ns.getServerMoneyAvailable("home") && ns.hasTorRouter() === true) {
					ns.singularity.purchaseProgram(lProgram);
				} else {
					ns.singularity.createProgram(lProgram, true);
				}
			}
			hProgram = hasProgram(ns, program)
			await ns.sleep(60000);
		}
	}
}