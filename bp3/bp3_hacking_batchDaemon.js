/** @param {NS} ns */

import * as hServers from "bp3_helpers_servers.js";

export function getRunningManagers(ns, script = "bp3_hacking_manager.js") {
    let net = hServers.networkScan(ns)
    let runningManagers = [];
    for (let i of net) {
        for (let j of net) {
            if (ns.isRunning(script, i, j))
                runningManagers.push(j);
        }
    }
    return runningManagers;
}

export function getMaxThreads(ns, hostServer, script, scriptHost) {
    //	ns.print("getMaxThreads: " + hostServer)
    let maxRam = ns.getServerMaxRam(hostServer);
    let scriptRam = ns.getScriptRam(script, scriptHost);
    let maxThreads = Math.floor(maxRam / scriptRam);
    return maxThreads;
}

export function distributeThreads(ns, script, hostList, totalThreads, target, action, batch) {
    hostList.sort((a, b) => hServers.getServerFreeRam(ns, b) - hServers.getServerFreeRam(ns, a));
    let remainingThreads = Math.ceil(totalThreads);
    for (let k of hostList) {
        if (remainingThreads > 0) {
            let hostMaxThreads = getMaxThreads(ns, k, script, k);
            let hostThreads = Math.min(hostMaxThreads, remainingThreads);
            //	ns.print(k + " " + hostThreads + " " + target)
            ns.print(target,action,batch);
            if (ns.exec(script, k, hostThreads, target, action, batch)) {
                remainingThreads = remainingThreads - hostThreads;
            }
        }
    }
    return remainingThreads;
}

export function getMaxBatchThreads(ns, target) {
    let serv = ns.getServer(target);
    let hThreads = Math.floor(ns.hackAnalyzeThreads(target, serv.moneyMax / 2))
    let secIncHack = Math.ceil(ns.hackAnalyzeSecurity(hThreads, target));
    let wThreadsHack = Math.ceil(secIncHack / ns.weakenAnalyze(1));
    let gThreads = Math.ceil(ns.growthAnalyze(target, 2));
    let wThreadsGrow = Math.ceil(ns.growthAnalyzeSecurity(gThreads, target, 1));
    return [hThreads + wThreadsHack + gThreads + wThreadsGrow, minSec(ns, target), maxMoney(ns, target)];
}

export async function scpHackingScripts(ns, destinationList) {
    let scripts = ["bp3_hack.js", "bp3_weaken.js", "bp3_grow.js"]
    let scriptHost = "home";
    for (let i of destinationList) {
        let destination = i;
        await ns.scp(scripts, destination, scriptHost);
    }
}

export function getWeakenThreads(ns, target) {
    return Math.ceil(secDecreaseRequired(ns, target) / ns.weakenAnalyze(1));

}

export function getMaxGrowthPercent(ns, target) {
    return ns.getServerMaxMoney(target) / (ns.getServerMoneyAvailable(target) + .00001);
}

export function getGrowThreads(ns, target, growthPercent) {
    return Math.ceil(ns.growthAnalyze(target, growthPercent));
}

export function getHackThreads(ns, target, moneyGoal) {
    let threads = ns.hackAnalyzeThreads(target, moneyGoal);
    ns.print("hacking threads for money goal: " + threads + " for " + ns.nFormat(moneyGoal, "0.00a"));
    return threads;
}

export function minSec(ns, target) {
    if (ns.getServerSecurityLevel(target) <= ns.getServerMinSecurityLevel(target) * 1.05) {
        return true;
    }
    return false;
}

export function maxMoney(ns, target) {
    if (ns.getServerMoneyAvailable(target) === ns.getServerMaxMoney(target)) {
        return true;
    }
    return false;
}

export function secDecreaseRequired(ns, target) {
    return ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
}

export function hackableMoney(ns, target) {
    let avail = ns.getServerMoneyAvailable(target);
    let moneyThresh = ns.getServerMaxMoney(target) / 2;
    return avail - moneyThresh;
}

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

export function getHackScripts(eventList) {
    let scriptList = [];
    for (let i of eventList) {
        scriptList.push(EVENT_LIST[EVENT_LIST.map(function (el) { return el.action }).indexOf(i)].script);
    }
    return scriptList;
}

export function scheduleEvents(ns, target, eventList = ["h", "w1", "g", "w2"], batchName, batchStart) {
    let events = [];
    for (let i of eventList) {
        events.push({ n: i, nScript: "", nStart: 0, nDur: 0, nEnd: 0, nThreads: 0, nBName: batchName, nBStart:batchStart, nBEnd:0 })
    }
    events = updateScripts(events, getHackScripts(eventList));
    events = updateTimes(ns, events, target);
    events = updateThreads(ns, events, target);
    ns.print("sort end");
    events.sort((a, b) => a.nEnd - b.nEnd);
    ns.print(events);

    ns.print("sort start");
    events.sort((a, b) => a.nStart - b.nStart);
    ns.print(events);
    return events;
}

export function getActionList(ns,target) {
    let actionList = [];
    if(ns.getServerMoneyAvailable(target) === ns.getServerMaxMoney(target) ) {
        actionList.push("h");
    }
    actionList.push("w1");
    if(ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
        actionList.push("g","w2");
    }
}

export function updateScripts(events, eventScripts = ["bp3_hack.js", "bp3_weaken.js", "bp3_grow.js", "bp3_weaken.js"]) {
    for (let i in events) {
        events[i].nScript = eventScripts[i];
    }
    return events
}

export function getActionTimes(ns, target, events) {
    let actionTimes = [];
    let actionList = events.map(function (el) { return el.n })
    for (let action of actionList) {
        switch (action) {
            case "h":
                actionTimes.push(ns.getHackTime(target));
                break;
            case "w1":
                actionTimes.push(ns.getWeakenTime(target));
                break;
            case "g":
                actionTimes.push(ns.getGrowTime(target));
                break;
            case "w2":
                actionTimes.push(ns.getWeakenTime(target));
                break;
        }
    }
    return actionTimes
}

export function updateTimes(ns, events, target) {
    let eventTimes = getActionTimes(ns, target, events);
    for (let i in events) {
        events[i].nDur = eventTimes[i];
    }
    let maxDur = Math.max.apply(Math, events.map(function (el) { return el.nDur })) + 8000;
    let endBatch = Math.max.apply(Math, events.map(function (el) { return el.nDur })) + 2000;
    for (let i in events) {
        events[i].nEnd = maxDur - (events.length - i) * 2000;
        events[i].nStart = events[i].nEnd - events[i].nDur;
    }
    return events;
}

export function updateThreads(ns, events, target, scriptList = ["bp3_hack.js", "bp3_weaken.js", "bp3_grow.js"]) {
    let availThreads = Math.floor(hServers.getNetworkRamAvailable(ns, false) / getMaxScriptRam(ns, scriptList) * .95);
    let hThreads = 0;
    let hWThreads = 0;
    let gThreads = 0;
    let gWThreads = 0;
    let gPerc = 1.05 * ns.getServerMaxMoney(target) / ns.getServerMoneyAvailable(target)
    if (hackableMoney(ns, target) > 0) {
        hThreads = getHackThreads(ns, target, hackableMoney(ns, target));
        ns.print("% hacked with single thread on target: " + ns.hackAnalyze(target) + " " + target);
        hWThreads = hThreads * .002 / .05;
        ns.print("sec inc hack: " + ns.hackAnalyzeSecurity(hThreads))
        let hackedAmount = ns.hackAnalyze(target) * ns.getServerMoneyAvailable(target) * hThreads;
        gPerc = 1.05 * ns.getServerMaxMoney(target) / (ns.getServerMoneyAvailable(target) - hackedAmount)
        gThreads = getGrowThreads(ns, target, gPerc);
        ns.print("sec inc grow: " + ns.growthAnalyzeSecurity(gThreads))
        gWThreads = gThreads * .004 / .05 * 1.05;
        ns.print("weaken per thread: " + ns.weakenAnalyze(1, 1));
    } else {
        hWThreads = secDecreaseRequired(ns, target) / .05;
        if (ns.getServerMoneyAvailable(target) === 0) {
            gThreads = 1;
        } else {
            gThreads = getGrowThreads(ns, target, gPerc);
        }
        gWThreads = gThreads * .004 / .05 * 1.05;
    }
    let tThreads = hThreads + hWThreads + gThreads + gWThreads;
    let threadSet = [Math.floor(hThreads), Math.ceil(hWThreads), Math.ceil(gThreads), Math.ceil(gWThreads)]
    ns.print("total batch threads: " + tThreads);
    ns.print("network Threads Avail: " + availThreads)
    if (tThreads > availThreads) {
        let hRatio = hThreads / tThreads;
        let hWRatio = hWThreads / tThreads;
        let gRatio = gThreads / tThreads;
        let gWRatio = gWThreads / tThreads;
        threadSet = [Math.floor(availThreads * hRatio), Math.ceil(availThreads * hWRatio), Math.ceil(availThreads * gRatio), Math.ceil(availThreads * gWRatio)]
    }
    let eventThreadSet = getEventThreadSet(ns, threadSet, events);
    for (let i in events) {
        ns.print(events[i].n, " ", events[i].nThreads, " ", threadSet[i], " ", Math.floor(events[i].nStart), " ", Math.floor(events[i].nDur), " ", Math.floor(events[i].nEnd));
        events[i].nThreads = eventThreadSet[i];
    }
    return events;
}

export function getEventThreadSet(ns, threadSet, events) {
    let actionThreadsList = [
        { action: "h", threads: threadSet[0] },
        { action: "w1", threads: threadSet[1] },
        { action: "g", threads: threadSet[2] },
        { action: "w2", threads: threadSet[3] },
    ]
    let actionThreads = [];
    let actionList = actionThreadsList.map(function (el) { return el.action })
    for (let i of events) {
        actionThreads.push(actionThreadsList[actionList.indexOf(i.n)].threads);
    }
    return actionThreads
}

export function getMaxScriptRam(ns, scriptList) {
    let maxRam = 0;
    for (let i of scriptList) {
        let sRam = ns.getScriptRam(i, "home");
        if (sRam > maxRam) {
            maxRam = sRam;
        }
    }
    return maxRam;
}

export async function launchScripts(ns, eventSchedule, target) {
    ns.print("Launch Start");
    let prevTime = Date.now();
    let maxDur = Math.max.apply(Math, eventSchedule.map(function (el) { return el.nDur })) + 8000;
    let finalSleep = maxDur - eventSchedule[eventSchedule.length - 1].nEnd + 2000;
    for (let i = 0; i < eventSchedule.length; i++) {
        //       ns.print(eventSchedule[i]);
        let hostServers = hServers.getAvailableHostServers(ns, false, ns.getScriptRam(eventSchedule[i].nScript, "home"));
        if (eventSchedule.nScript === "bp3_hack.js" && (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target) / 2)) {
            let sleepTime = 0;
            if (i === 0) {
                sleepTime = eventSchedule[i].nStart;
            } else {
                sleepTime = eventSchedule[i].nStart - eventSchedule[i - 1].nStart;
            }
            ns.print("sleeping for " + sleepTime);
            await ns.sleep(sleepTime)
            //       printServerStatus(ns, target);
        } else {
            let sleepTime = 0;
            if (i === 0) {
                sleepTime = eventSchedule[i].nStart;
            } else {
                sleepTime = eventSchedule[i].nStart - eventSchedule[i - 1].nStart;
            }
            let mSec = minSec(ns,target);
            while(!mSec) {
                for(let j of eventSchedule) {
                    j.nStart=j.nStart +2000;
                    j.nEnd = j.nEnd + 2000;
                }
                await ns.sleep(2000);
                mSec = minSec(ns,target);
            }
            ns.print("sleeping for " + sleepTime);
            await ns.sleep(sleepTime)
            ns.print("Distributing: " + eventSchedule[i].n, " ", eventSchedule[i].nThreads, " ", Math.floor(eventSchedule[i].nStart), " ", Math.floor(eventSchedule[i].nDur), " ", Math.floor(eventSchedule[i].nEnd));
            distributeThreads(ns, eventSchedule[i].nScript, hostServers, eventSchedule[i].nThreads, target, eventSchedule[i].n, eventSchedule[i].nBName)
            let currentTime = Date.now();
            let elapsedTime = currentTime - prevTime;
            ns.print(elapsedTime);
            ns.print("secDif " + (ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target)));
            prevTime = currentTime;
            //     printServerStatus(ns, target);
        }
    }
    ns.print("sleeping for " + finalSleep);
    await ns.sleep(finalSleep);
}

export function printServerStatus(ns, target) {
    ns.print("secDif " + (ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target)));
    ns.print("money perc in dec " + ns.getServerMoneyAvailable(target) / ns.getServerMaxMoney(target));
}

export const EVENT_LIST = [{ action: "h", script: "bp3_hack.js" }, { action: "w1", script: "bp3_weaken.js" }, { action: "g", script: "bp3_grow.js" }, { action: "w2", script: "bp3_weaken.js" }]






export async function main(ns) {

//batch management per target
//schedule up to 3 batches
//when 1 batch ends, schedule next batch





}