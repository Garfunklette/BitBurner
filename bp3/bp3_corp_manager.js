/** @param {NS} ns */
import * as hCorp from "bp3_helpers_corp.js"

export async function main(ns) {
	ns.disableLog('ALL')
	let corp = ns.corporation.getCorporation();
	let divs = corp.divisions;
	let productDivs = divs.filter(el => ns.corporation.getDivision(el).makesProducts)
	let nonProductDivs = divs.filter(el => !ns.corporation.getDivision(el).makesProducts)
	let fundBuffer = 5e9;
	let sleepTime = 10000

	while (true) {
		//warehouse space
		//--sales
		//----advertising
		//----marketPrice
		//--expansion
		//consumption
		//--employees
		//exporting
		//development
		//production
		//--employees
		//--production multi
		//----warehouse space
		//----materials

		corp = ns.corporation.getCorporation()
		let offer = ns.corporation.getInvestmentOffer()


		if (offer.round === 1) {
			let divName = "FishFarm"
			await hCorp.bpmForAg(ns, divName, hCorp.AgProdMat1);
		}

		if (hCorp.corpInvestCheck(ns, 210e9, 1)) {
			hCorp.corpInvest1(ns);
			let divName = "FishFarm"
			await hCorp.bpmForAg(ns, divName, hCorp.AgProdMat2);
			await ns.sleep(60000)
			}
		if (hCorp.corpInvestCheck(ns, 5e12, 2)) {
			let divType = "Tobacco";
			hCorp.divStartup(ns, divType)
			hCorp.corpInvest2(ns);
			let divName = "FishFarm"
			await hCorp.bpmForAg(ns, divName, hCorp.AgProdMat3);
			await ns.sleep(60000)
			}
		if (hCorp.corpInvestCheck(ns, 800e12, 3)) {

		}

	//	ns.print("==All Divisions==")
		if (offer.round <= 3) {
	//		ns.print(ns.formatNumber(offer.funds)," ",offer.round);
		}

		//hCorp.warehouseMonitor(ns);

		divs.sort((a, b) => productDivs.indexOf(b) - productDivs.indexOf(a))

		for (let i of divs) {
		//	ns.print(i," ",ns.formatNumber(ns.corporation.getDivision(i).productionMult))
			let divInfo = ns.corporation.getDivision(i)
			let cities = divInfo.cities;
			cities.sort((a, b) => ns.corporation.getOffice(i, a).size - ns.corporation.getOffice(i, b).size)
			if (ns.corporation.getCorporation().funds > ns.corporation.getHireAdVertCost(i)) {
				if (productDivs.indexOf(i) > -1) {
					await hCorp.expandOffice(ns, i)
				}
			}
			if (ns.corporation.getCorporation().funds > ns.corporation.getHireAdVertCost(i)) {
				if (productDivs.indexOf(i) > -1) {
					let maxAdverts = hCorp.getMaxAdVerts(ns, i)
					for (let n = 0; n < maxAdverts; n++) {
						ns.corporation.hireAdVert(i)
					}
				}
			}
			cities = cities.filter(el=>ns.corporation.hasWarehouse(i,el));
			cities.sort((a, b) => ns.corporation.getWarehouse(i, a).size - ns.corporation.getWarehouse(i, b).size)
			for (let j of cities) {
				if (ns.corporation.getCorporation().funds > fundBuffer && ns.corporation.getWarehouse(i, j).sizeUsed > ns.corporation.getWarehouse(i, j).size * .9) {
					let maxAdverts = hCorp.getMaxAdVerts(ns, i)
					for (let n = 0; n < maxAdverts; n++) {
						ns.corporation.hireAdVert(i)
					}
					hCorp.updateMaterialPrices(ns, i, j);
					hCorp.setAllExportIProd(ns);
				}
			}
			if (productDivs.indexOf(i) > -1) {
				hCorp.setMarketPrices(ns, i)
			} else {
				if (ns.corporation.getDivision(i).productionMult < 500) {
					if (ns.corporation.getCorporation().funds > fundBuffer * 50)
						await hCorp.purchaseProdMats(ns, i);
				}
			}
		}

		await hCorp.assignAllJobs(ns)

		if (ns.corporation.getCorporation().divisions.indexOf("PuffinPuffin") > -1) {
			if (ns.corporation.getCorporation().funds > fundBuffer * 10) {
				if (ns.corporation.getOffice("PuffinPuffin", "Sector-12").size >= 300) {
					hCorp.buyAllUpgrades(ns)
				}
			}

			if (ns.corporation.getCorporation().funds > ns.corporation.getOfficeSizeUpgradeCost("PuffinPuffin", "Sector-12", 18)) {
				for (let k of productDivs) {
					ns.print("  Updating Products")
					hCorp.productTasks(ns, k);
				}
			}
		}

		hCorp.repDonations(ns)
		if (corp.public) {
			hCorp.buyBackAllShares(ns);
		}

	//	ns.print("Home funds " + ns.formatNumber(ns.getServerMoneyAvailable("home"), "0.00a"))
	//	ns.print("Corporate funds: " + ns.formatNumber(ns.corporation.getCorporation().funds, "0.00a"));
		sleepTime = (ns.corporation.getBonusTime() > 0 ? 1000 : 10000)
		await ns.sleep(sleepTime)
	//	ns.clearLog();
	}
}