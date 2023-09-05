/** @param {NS} ns */
import * as hHacking from "bp3_helpers_hacking.js"
import * as hServers from "bp3_helpers_servers.js"



//get free ram
//determine number of threads we can run
//create target list and sort
//figure out what's already running
//choose target
//figure out thread ratio per batch
//time and distribute actions
//whwgw
//get weaken time, time should be 2 + weaken time - grow time
//get grow time

export async function main(ns) {
   let args = [];
    let target = args[0] || ns.args[0];
    ns.disableLog('ALL')
    let batchName = args[1] || ns.args[1];
    let waitTime = args[2] || ns.args[2] || 0;


    ns.disableLog('ALL')
    hServers.getRootAccess(ns, target);
    if (ns.hasRootAccess(target) === true) {
        //     find available ram for those threads
        let hostServers = hServers.getAvailableHostServers(ns, false, ns.getScriptRam("bp3_weaken.js", "home"));
        //     copy the weaken script to the server(s) with RAM
        await hHacking.scpHackingScripts(ns, hostServers)

        let eventSchedule = hHacking.scheduleEvents(ns, target,["w1","g","w2"],batchName,waitTime);

        await hHacking.launchScripts(ns, eventSchedule, target);

        ns.print(ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target))
        ns.print(ns.getServerMoneyAvailable(target) / ns.getServerMaxMoney(target));

    }
}