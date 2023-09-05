/** @param {NS} ns */

async function totalWaysToSumI(ns, filename, host) {
	ns.disableLog('sleep');
	ns.print("start test function totalWaysToSumI")
	let data = ns.codingcontract.getData(filename, host);
	ns.print("starting data")
	ns.print(data)
	let answer = [];
	let limiter = Math.pow(data, 2);
	for (let i = data - 1; i > 0; i--) {
		let remainder = data;
		let tempAnswer = [];
		while (remainder > 0) {
			let inc = remainder - 1;
			if (remainder - inc === 0) {
				inc--;
			} else {
				remainder = remainder - inc;
				tempAnswer.push(inc);
			}
			limiter--;
			if (limiter < 0) {
				break;
			}
			await ns.sleep(500)
			answer.push(tempAnswer);
		}
		//	ns.print(tempAnswer);
		
	}
	ns.print(answer)


}

function arrayJumpingGameII(ns,filename,host) {
	ns.print("start test function arrayJumpingGameII")
	let data = ns.codingcontract.getData(filename, host);
	ns.print("starting data")
	ns.print(data)
	let jumpLength = data[0];
	let currentIndex = 0;
	//get slice of available jumps
	//for each element of slice, add destination index to path
	//close bitburner and work
}


export async function main(ns) {
	let type = ns.args[0] || -1
	if (type === -1) {
		let types = ns.codingcontract.getContractTypes();
		for (let j of types) {
			ns.print(j);
		}
	} else {
		let files = ns.ls("home", ".cct")
		let filename = ""
		let filefound = false;
		for (let i of files) {
			if (ns.codingcontract.getContractType(i) === type) {
				filename = i;
				filefound = true;
				break;
			}
		}
		if (!filefound) {
			ns.codingcontract.createDummyContract(type);
			files = ns.ls("home", ".cct")
			for (let i of files) {
				if (ns.codingcontract.getContractType(i) === type) {
					filename = i;
					filefound = true;
					break;
				}
			}
		}
		let host = "home"
		ns.print(ns.codingcontract.getDescription(filename, host));
		let data = ns.codingcontract.getData(filename, host);
		ns.print("starting data")
		ns.print(data)
		await totalWaysToSumI(ns, filename, host)
	}
}