/** @param {NS} ns */
export function networkScan(ns) {
	let scannable = ["home"];
	let scanned = [];
	let scanLen = scannable.length;
	while (scanLen > 0) {
		let scanMe = scannable.pop();
		let newScan = ns.scan(scanMe);
		scanned.push(scanMe);
		for (let j of newScan) {
			if (scanned.indexOf(j) < 0) {
				scannable.push(j);
			}
		}
		scanLen = scannable.length;
	}
	return scanned;
}

export function startFindPath(ns,target) {
	let startServer = ns.getHostname();
	if (target === undefined) {
		ns.alert('Please provide target server');
		return;
	}
	let [results, isFound] = findPath(ns, target, startServer, [], [], false);
	if (!isFound) {
		ns.alert('Server not found!');
	} else {
		ns.tprint(results.join('; connect '));
	}
	return results;
}

export const findPath = (ns, target, serverName, serverList, ignore, isFound) => {
	ignore.push(serverName);
	let scanResults = ns.scan(serverName);
	for (let server of scanResults) {
		if (ignore.includes(server)) {
			continue;
		}
		if (server === target) {
			serverList.push(server);
			return [serverList, true];
		}
		serverList.push(server);
		[serverList, isFound] = findPath(ns, target, server, serverList, ignore, isFound);
		if (isFound) {
			return [serverList, isFound];
		}
		serverList.pop();
	}
	return [serverList, false];
}

export function connectToServer(ns,target) {
		let startServer = ns.getHostname();
	if (target === undefined) {
		ns.alert('Please provide target server');
		return;
	}
	let [results, isFound] = findPath(ns, target, startServer, [], [], false);
	if (!isFound) {
		ns.alert('Server not found!');
	} else {
		ns.print(results);
	}

	for(let i of results) {
		ns.singularity.connect(i);
	}
	return results;
}

export function getTargetScore(ns, target) {
	//money per second per thread
	let moneyPerThread = ns.hackAnalyze(target);
	let wTime = ns.getWeakenTime(target);
	let gTime = ns.getGrowTime(target);
	let hTime = ns.getHackTime(target);
	let runTime = wTime * 2 + gTime + hTime;
	let score = moneyPerThread / runTime * 1e10;
	return score;
}


export function getTargetList(ns) {
	let fullList = networkScan(ns);
	let canHasMoney = fullList.filter(el => ns.getServerMaxMoney(el) > 10000);
	canHasMoney.sort((a, b) => getTargetScore(ns, b) - getTargetScore(ns, a));
	return canHasMoney;
}

export function getServerFreeRam(ns, target) {
	return ns.getServerMaxRam(target) - ns.getServerUsedRam(target);
}

export function getAvailableHostServers(ns, includeHome = true, minRam = 0, includeHacknet = false) {
	let fullList = networkScan(ns);
	let nuked = fullList.filter(el => ns.hasRootAccess(el));
	let freeRamServers = nuked.filter(el => getServerFreeRam(ns, el) > minRam);
	freeRamServers=freeRamServers.filter(el=> ns.ls(el,"bp3_doNotUse.js").length <1)
	
	if(includeHacknet) {
	freeRamServers=freeRamServers.filter(el=> !el.includes("hacknet"));
	}
	
	if(getServerFreeRam(ns,"home")>minRam && freeRamServers.indexOf("home")<0) {
		freeRamServers.push("home")
	}
	return freeRamServers;
}

export function getNetworkRamAvailable(ns, includeHome = true) {
	let fullList = networkScan(ns);
	let nuked = fullList.filter(el => ns.hasRootAccess(el));
	let totalRam = 0;
	for (let i of nuked) {
		totalRam = totalRam + getServerFreeRam(ns, i);
	}
	if (includeHome === false) {
		totalRam = totalRam - getServerFreeRam(ns, "home");
	}
	return totalRam;
}

export function getNetworkRamTotal(ns) {
	let fullList = networkScan(ns);
	let nuked = fullList.filter(el => ns.hasRootAccess(el));
	let totalRam = 0;
	for (let i of nuked) {
		if (i !== "home") {
			totalRam = totalRam + ns.getServerMaxRam(i);
		}
	}
	return totalRam;
}

export function getRootAccess(ns, target) {
	if (ns.hasRootAccess(target) === false) {
		let exes = ns.ls("home", ".exe");
		if (exes.indexOf("BruteSSH.exe") > -1) {
			ns.brutessh(target);
		}
		if (exes.indexOf("FTPCrack.exe") > -1) {
			ns.ftpcrack(target);
		}
		if (exes.indexOf("relaySMTP.exe") > -1) {
			ns.relaysmtp(target);
		}
		if (exes.indexOf("HTTPWorm.exe") > -1) {
			ns.httpworm(target);
		}
		if (exes.indexOf("SQLInject.exe") > -1) {
			ns.sqlinject(target);
		}
		let serv = ns.getServer(target);
		if (serv.numOpenPortsRequired <= serv.openPortCount) {
			if (ns.nuke(target)) {
				ns.tprint(target + " rooted")
			}
		}
	}
}

export function rootAll(ns) {
	let list = networkScan(ns);
	for (let i of list) {
		getRootAccess(ns, i);
	}
}

/** @param {NS} ns **/
export async function main(ns) {
	
}