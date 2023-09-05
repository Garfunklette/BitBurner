/** @param {NS} ns */
import * as hHacking from "bp3_helpers_hacking.js"
import * as hServers from "bp3_helpers_servers.js"
import * as hPorts from "bp3_helpers_ports.js"

/*
loop forever {
    if security is not minimum {
        determine how many threads we need to lower security to the minimum
        find available ram for those threads
        copy the weaken script to the server(s) with RAM
        launch the weaken script(s)
        sleep until weaken is finished
    } else if money is not maximum {
        do the same thing, but with the grow script
    } else {
        do the same thing, but with the hack script
    }
}
*/

export async function main(ns) {
    let target = ns.args[0];
    ns.disableLog("getServerMaxRam");
    ns.disableLog("getServerUsedRam");
    hServers.getRootAccess(ns, target);
    if (ns.hasRootAccess(target) === true) {
        while (true) {
            // if security is not minimum {
            if (hHacking.minSec(ns, target) === false) {
                //     determine how many threads we need to lower security to the minimum
                let weakenThreads = hHacking.getWeakenThreads(ns, target);

                //     find available ram for those threads
                let hostServers = hServers.getAvailableHostServers(ns, false, ns.getScriptRam("bp3_weaken.js", "home"));
                //     copy the weaken script to the server(s) with RAM
                await hHacking.scpHackingScripts(ns, hostServers)
                //     launch the weaken script(s)
                hHacking.distributeThreads(ns, "bp3_weaken.js", hostServers, weakenThreads, target);
                //     sleep until weaken is finished
                let wTime = ns.getWeakenTime(target);
                hPorts.writeHackDataToPort(ns, 1, target, "weaken", weakenThreads, wTime);
                await ns.sleep(wTime + 500);
            } else {
                if (hHacking.maxMoney(ns, target) === false) {
                    // } else if money is not maximum {
                    //     do the same thing, but with the grow script
                    let growThreads = hHacking.getGrowThreads(ns, target, hHacking.getMaxGrowthPercent(ns, target));
                    //     find available ram for those threads
                    let hostServers = hServers.getAvailableHostServers(ns, false, ns.getScriptRam("bp3_grow.js", "home"));
                    //     copy the weaken script to the server(s) with RAM
                    await hHacking.scpHackingScripts(ns, hostServers)
                    //     launch the weaken script(s)
                    hHacking.distributeThreads(ns, "bp3_grow.js", hostServers, growThreads, target);
                    let gTime = ns.getGrowTime(target);
                    hPorts.writeHackDataToPort(ns, 1, target, "grow", growThreads, gTime);
                    //     sleep until weaken is finished
                    await ns.sleep(gTime + 500);
                } else {
                    //} else {
                    //  do the same thing, but with the hack script
                    //     determine how many threads we need to lower security to the minimum
                    let hackThreads = hHacking.getHackThreads(ns, target, hHacking.hackableMoney(ns, target));

                    //     find available ram for those threads
                    let hostServers = hServers.getAvailableHostServers(ns, false, ns.getScriptRam("bp3_hack.js", "home"));
                    //     copy the weaken script to the server(s) with RAM
                    await hHacking.scpHackingScripts(ns, hostServers)
                    //     launch the weaken script(s)
                    hHacking.distributeThreads(ns, "bp3_hack.js", hostServers, hackThreads, target);
                    let hTime = ns.getHackTime(target)
                    hPorts.writeHackDataToPort(ns, 1, target, "hack", hackThreads, hTime);

                    //     sleep until weaken is finished
                    await ns.sleep(hTime + 500);
                    //}
                }
            }
            await ns.sleep(1000);
        }
    }
}