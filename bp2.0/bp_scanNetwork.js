/** @param {NS} ns **/
export function scanNetwork(ns) {
	let net = [];
	let start = ns.getHostname();
	net.push(start);
	let toScan = [];
	toScan.push(start);
	let scanMe = toScan[0];
	let scanned = [];
	while (toScan.length > 0) {
		scanMe = toScan.pop();
		scanned = ns.scan(scanMe);
		for (let i in scanned) {
			if (net.indexOf(scanned[i]) < 0) {
				net.push(scanned[i]);
				toScan.push(scanned[i]);
			}
		}
	}
	return net;
}

export async function main(ns) {

	//scan node
	//if scanned node not in network, push to network and push to toScan list
	//if scanned node already in network, drop from toScan list
let net =scanNetwork(ns);
ns.print(net);
	//initialize
ns.print(net.length);
}
