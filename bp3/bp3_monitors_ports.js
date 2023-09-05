/** @param {NS} ns */
export async function main(ns) {
ns.disableLog('sleep');
let targetList = [];
	while (true) {
		while(ns.getPortHandle(1).empty() === false) {
		
		let readline = ns.readPort(1);
		readline=JSON.parse(readline);
		if(readline.action === "hack")
		ns.print(readline.target)
		ns.print(targetList.indexOf(readline.target))
		if(targetList.indexOf(readline.target)<0) {
			targetList.push(readline.target)
		} else {
			targetList[readline.target.totHack]=targetList[readline.target.totHack]+readline.result
		}
		
		ns.print(targetList)
		}	
	await ns.sleep(1000);
}

}