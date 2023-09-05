/** @param {NS} ns */

function getPositions(ns, SYMBOLS) {
	let positions = [];
	for (let i of SYMBOLS) {
		let pos = ns.stock.getPosition(i)
		if (pos[0] > 0 || pos[2] > 0) {
			positions.push(
				{
					sym: i,
					longQty: pos[0],
					longPrice: pos[1],
					shortQty: pos[2],
					shortPrice: pos[3],
				}
			)
		}
	}
	return positions;
}

function sellAllStocks(ns,positions) {
	for(let i of positions) {
		if(i.longQty>0) {
			ns.stock.sellStock(i.sym,i.longQty);
		}
		if(i.shortQty>0) {
			ns.stock.sellStock(i.sym,i.shortQty);
		}
	}
}

export async function main(ns) {
	const SYMBOLS = ns.stock.getSymbols();
	let positions = getPositions(ns,SYMBOLS)
	sellAllStocks(ns,positions)
}