/** @param {NS} ns */

import * as hPservers from "bp3_helpers_pservers.js"

export async function main(ns) {

ns.tprint(hPservers.maxAffordable(ns,ns.getServerMoneyAvailable("home")));
ns.tprint("Cost of next: "+ns.nFormat(ns.getPurchasedServerCost(hPservers.maxAffordable(ns,ns.getServerMoneyAvailable("home"))*2),"0.00a"));
}