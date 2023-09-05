/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('ALL')
let list = ns.getPurchasedServers();
let hasDoNotUse = false;
list.sort((a,b)=>ns.getServerMaxRam(a)-ns.getServerMaxRam(b))
for(let i of list) {
	hasDoNotUse=false;
	if(ns.ls(i).indexOf("bp3_doNotUse.js")>-1) {
		hasDoNotUse = true
	}
	ns.print(i," ",ns.getServerMaxRam(i)," ",hasDoNotUse)
}



}