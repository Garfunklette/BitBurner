/** @param {NS} ns */

export function spiralizer(ns, filename, host) {
	let data = ns.codingcontract.getData(filename, host);
	ns.print("start contract " + filename, host)
	ns.print(data);
	let answer = [];
	//array 1, push all elements to answer
	for (let i = 0; i < Math.pow(data.length, 2); i++) {
		ns.print("spiralizer top")
		if (data.length === undefined || data.length === 0) {
			break;
		}
		let shifted = data.shift();
		answer = answer.concat(shifted);
		ns.print(data)
		//all arrays, pop last element push last element of each to answer
		ns.print("spiralizer right")
		if (data.length === undefined || data.length === 0) {
			break;
		}
		for (let j in data) {
			if (data[j].length === undefined || data[j].length === 0) {
				data.splice(j, 1)
				j--
			} else {
				answer.push(data[j].pop())
			}
		}
		ns.print(data)
		//last array, pop all elements, push to answer
		ns.print("spiralizer bottom")
		if (data.length === undefined || data.length === 0) {
			break;
		}
		let popped = data.pop()
		for (let k = popped.length; k > 0; k--) {
			answer.push(popped.pop());
		}
		ns.print(data)
		//all arrays, end to start, shift first elements, push to answer
		ns.print("spiralizer left")
		if (data.length === undefined || data.length === 0) {
			break;
		}
		ns.print(data)
		for (let m = data.length; m > 0; m--) {
			ns.print(m)
			ns.print(data[m - 1])
			if (data[m - 1].length === undefined || data[m - 1].length === 0) {
				data.splice(m - 1, 1)
				m++
			} else {
				answer.push(data[m - 1].shift())
			}
		}
		//start over
		ns.print("end loop")
		ns.print("answer")
		ns.print(answer);
		ns.print("remaining data")
		ns.print(data)
	}
	answer = answer.filter(a => a);

	ns.print("answer")
	ns.print(answer);
	ns.print("remaining data")
	ns.print(data)
	ns.print("end contract " + filename, " ", host)
	return answer
}

const LetterList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

function cipher(ns, letter, shiftNumber, direction = "right") {
	if (letter === " ") {
		return " "
	} else {
		let letterNumber = LetterList.indexOf(letter) + 1;
		let shiftedNumber = -1;
		if (direction === "right") {
			shiftedNumber = letterNumber + shiftNumber
			shiftedNumber = (shiftedNumber > 26 ? shiftedNumber - 26 : shiftedNumber);
		} else {
			shiftedNumber = letterNumber - shiftNumber
			shiftedNumber = (shiftedNumber < 1 ? shiftedNumber + 26 : shiftedNumber);
		}
		return LetterList[shiftedNumber - 1]
	}
}

export function vigenereCipher(ns, filename, host) {
	let data = ns.codingcontract.getData(filename, host);
	let encodedLength = data[0].length;
	let decoderRepeatedNo = Math.ceil(encodedLength / data[1].length);
	let decoder = data[1].repeat(decoderRepeatedNo).slice(0, encodedLength);
	let answer = ""
	ns.print(decoder)
	for (let i in data[0]) {
		answer = answer + cipher(ns, data[0][i], LetterList.indexOf(decoder[i]));
	}
	ns.print(data[0]);
	ns.print(decoder)
	ns.print(answer);
	return answer;
}

export function caesarCipher(ns, filename, host) {
	let data = ns.codingcontract.getData(filename, host);
	ns.print(data)
	let answer = ""
	for (let i in data[0]) {
		answer = answer + (cipher(ns, data[0][i], data[1], "left"))
	}
	return answer;
}

export function shortestPathInaGrid(ns, filename, host) {
	let data = ns.codingcontract.getData(filename, host);
	ns.print(data)
}

export function algorithmicStockTraderI(ns, filename, host) {
	let data = ns.codingcontract.getData(filename, host);
	ns.print("start data");
	ns.print(data)
	let bestData = -1
	let bestRemainder = -1
	let bestProfit = 0;
	for (let i = 0; i < data.length; i++) {
		for (let j = i + 1; j < data.length; j++) {
			let profit = data[j] - data[i];
			if (profit > bestProfit) {
				bestData = i;
				bestRemainder = j
				bestProfit = profit
			}
		}
	}
	return bestProfit
}

export function subarrayWithMaximumSum(ns, filename, host) {
	let data = ns.codingcontract.getData(filename, host);
	ns.print("start data");
	ns.print(data)
	let max = (data.reduce((a, b) => Math.max(a, b), -Infinity));
	let answer = max;
	if (max <= 0) {
		return answer;
	} else {
		let topArray = []
		topArray.push(max);
		for (let i = 0; i < data.length; i++) {
			for (let j = i; j < data.length + 1; j++) {
				let sliceArr = data.slice(i, j)
				let sliceSum = sumOfArray(ns, sliceArr);
				if (answer < sliceSum) {
					topArray = sliceArr;
					answer = sliceSum;
				}
				ns.print(i, " ", j, " ", sliceArr, " ", sliceSum);
			}
		}
	}
	ns.print(data);
	return answer;
}

function sumOfArray(ns, arr) {
	let sumArr = arr.reduce((acc, curr) => acc + curr, 0)
	return sumArr;
}

function findAllValidMathExpressions(ns, filename, host) {
	let data = ns.codingcontract.getData(filename, host);
	ns.print("start data");
	ns.print(data)
	let operators = ["+", "-", "*"]
	let result = data[1];
	let dataString = data[0].toString();
	let answers = [];
	ns.print(dataString)
	for (let i = 1; i < dataString.length - 1; i++) {
		ns.print(dataString[i])
		for (let j of operators) {
			dataString.splice(i, 0, j)
			if (eval(dataString) === result) {
				answers.push(dataString)
			}
		}
	}
}

export function findLargestPrimeFactor(ns, filename, host) {
	let data = ns.codingcontract.getData(filename, host);
	ns.print("start data");
	ns.print(data)
	let answer = maxPrimeFactor(data)
	return answer;
}

function maxPrimeFactor(n) {
	let maxPrime = -1;
	while (n % 2 == 0) {
		n = n / 2;
		maxPrime = 2;
	}
	while (n % 3 == 0) {
		n = n / 3;
		maxPrime = 3;
	}
	for (let i = 5; i <= Math.sqrt(n); i += 6) {
		while (n % i == 0) {
			maxPrime = i;
			n = n / i;
		}
		while (n % (i + 2) == 0) {
			maxPrime = i + 2;
			n = n / (i + 2);
		}
	}
	return n > 4 ? n : maxPrime;
}

export async function main(ns) {

	let filename = ns.args[0]
	let host = ns.args[1]

	ns.print(ns.codingcontract.getData(filename, host));
	ns.print(findLargestPrimeFactor(ns, filename, host))



}