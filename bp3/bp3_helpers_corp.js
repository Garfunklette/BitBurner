/** @param {NS} ns */

import * as hAugs from "bp3_helpers_augs.js"
import * as hFactions from "bp3_helpers_factions.js";
import { FactionNames } from "bp3_data_factions.js"
import * as dCorp from "bp3_data_corporation.js"


// =======Corp Start=========
export function createCorp(ns) {
	if (ns.getServerMoneyAvailable("home") > 150e9) {
		ns.corporation.createCorporation(CorpName, true);
	}
}

export function getFunds(ns) {
	let funds = ns.corporation.getCorporation().funds;
	return funds
}

export function expandDivision(ns, divType, divName) {
	let existingDivs = ns.corporation.getCorporation().divisions;
	if (existingDivs.map(function (el) { return ns.corporation.getDivision(el).type }).includes(divType)) {
		ns.print(divType + "division " + divName + " already exists")
		return false;
	} else {
		if (ns.corporation.getCorporation().funds > ns.corporation.getIndustryData(divType).startingCost) {
			ns.print("Expanding to industry "+divType)
			ns.corporation.expandIndustry(divType, divName);
			return true;
		}
	}
}

export function hireToMax(ns, div, city) {
	let office = ns.corporation.getOffice(div, city)
	let hireQty = office.size - office.numEmployees
	if (hireQty > 0) {
		for (let i = 0; i < hireQty; i++)
			ns.corporation.hireEmployee(div, city)
	}
}

export function getJobAssignmentSet(ns, div, city, spread) {
	let jobAssigns = [];
	let office = ns.corporation.getOffice(div, city)
	let numEmp = office.numEmployees;
	let distTot = spread.reduce((acc, curr) => acc + curr, 0);
	let unemployed = getUnemployed(ns, div, city)

	for (let i in Jobs) {
		jobAssigns.push(
			{
				jobName: Jobs[i],
				currentEmps: office.employeeJobs[Jobs[i]],
				goalEmps: Math.floor(spread[i] / distTot * numEmp),
				diff: Math.floor(spread[i] / distTot * numEmp) - office.employeeJobs[Jobs[i]]
			}
		)
		unemployed = unemployed + jobAssigns[i].diff
	}

	if (unemployed > 0) {
		jobAssigns.jobName["Interns"][goalEmps] = jobAssigns.jobName["Interns"][goalEmps] + unemployed
	}
	ns.print(jobAssigns)
	ns.print("first")
	ns.print(jobAssigns[0])
	jobAssigns.sort((a, b) => jobAssigns[a].diff - jobAssigns[b].diff);
	return jobAssigns;
}

export async function assignJobs(ns, div, city, spread = JobDistEven) {
	hireToMax(ns, div, city)
	let waitTime = 10000;
	if (ns.corporation.getBonusTime() > 50000) {
		waitTime = 1000;
	}
	let numEmp = ns.corporation.getOffice(div, city).numEmployees
	if (numEmp < 4) {
		spread = JobDistStart;
	}
	let distTot = spread.reduce((acc, curr) => acc + curr, 0);
	//down to 0

	let assign = Math.floor(1 / distTot * numEmp)

	let job = [Jobs[0]]

	job = Jobs[5]
	if (assign !== ns.corporation.getOffice(div, city).employeeJobs[job]) {
		assign = Math.ceil(numEmp / 8)
		if (ns.corporation.getOffice(div, city).employeeJobs["Unassigned"] >= assign - ns.corporation.getOffice(div, city).employeeJobs[job] || ns.corporation.getOffice(div, city).employeeJobs[job] < assign) {
			await ns.corporation.setAutoJobAssignment(div, city, job, assign)
			await ns.sleep(waitTime);
		}
	}
	let salaried = ns.corporation.getOffice(div, city).numEmployees - ns.corporation.getOffice(div,city).employeeJobs[Jobs[5]];
	job = Jobs[0]
	assign = Math.floor(1/5*salaried)
	if (assign !== ns.corporation.getOffice(div, city).employeeJobs[job]) {
		assign = Math.min(Math.floor(1 / distTot * numEmp), ns.corporation.getOffice(div, city).employeeJobs["Unassigned"])
		if (ns.corporation.getOffice(div, city).employeeJobs["Unassigned"] >= assign - ns.corporation.getOffice(div, city).employeeJobs[job] || ns.corporation.getOffice(div, city).employeeJobs[job] < assign) {
			await ns.corporation.setAutoJobAssignment(div, city, job, assign)
			await ns.sleep(waitTime);
		}
	}
	salaried = ns.corporation.getOffice(div, city).numEmployees - ns.corporation.getOffice(div,city).employeeJobs[Jobs[5]];
	job = Jobs[1]
	assign = Math.floor(1/5*salaried)
	if (assign !== ns.corporation.getOffice(div, city).employeeJobs[job]) {
		assign = Math.min(Math.floor(1 / distTot * numEmp), ns.corporation.getOffice(div, city).employeeJobs["Unassigned"])
		if (ns.corporation.getOffice(div, city).employeeJobs["Unassigned"] >= assign - ns.corporation.getOffice(div, city).employeeJobs[job] || ns.corporation.getOffice(div, city).employeeJobs[job] < assign) {
			await ns.corporation.setAutoJobAssignment(div, city, job, assign)
			await ns.sleep(waitTime);
		}
	}
	salaried = ns.corporation.getOffice(div, city).numEmployees - ns.corporation.getOffice(div,city).employeeJobs[Jobs[5]];
	job = Jobs[3]
	assign = Math.floor(1/5*salaried)
	if (assign !== ns.corporation.getOffice(div, city).employeeJobs[job]) {
		assign = Math.min(Math.floor(1 / distTot * numEmp), ns.corporation.getOffice(div, city).employeeJobs["Unassigned"])
		if (ns.corporation.getOffice(div, city).employeeJobs["Unassigned"] >= assign - ns.corporation.getOffice(div, city).employeeJobs[job] || ns.corporation.getOffice(div, city).employeeJobs[job] < assign) {
			await ns.corporation.setAutoJobAssignment(div, city, job, assign)
			await ns.sleep(waitTime);
		}
	}
		salaried = ns.corporation.getOffice(div, city).numEmployees - ns.corporation.getOffice(div,city).employeeJobs[Jobs[5]];
	job = Jobs[2]
	assign = Math.floor(1/5*salaried)
	if (assign !== ns.corporation.getOffice(div, city).employeeJobs[job]) {
		assign = Math.min(Math.floor(1 / distTot * numEmp), ns.corporation.getOffice(div, city).employeeJobs["Unassigned"])
		if (ns.corporation.getOffice(div, city).employeeJobs["Unassigned"] >= assign - ns.corporation.getOffice(div, city).employeeJobs[job] || ns.corporation.getOffice(div, city).employeeJobs[job] < assign) {
			await ns.corporation.setAutoJobAssignment(div, city, job, assign)
			await ns.sleep(waitTime);
		}
	}	
	salaried = ns.corporation.getOffice(div, city).numEmployees - ns.corporation.getOffice(div,city).employeeJobs[Jobs[5]];
	job = Jobs[4]
	assign = Math.floor(1/5*salaried)
	if (assign !== ns.corporation.getOffice(div, city).employeeJobs[job]) {
		assign = Math.min(Math.floor(1 / distTot * numEmp), ns.corporation.getOffice(div, city).employeeJobs["Unassigned"])
		if (ns.corporation.getOffice(div, city).employeeJobs["Unassigned"] >= assign - ns.corporation.getOffice(div, city).employeeJobs[job] || ns.corporation.getOffice(div, city).employeeJobs[job] < assign) {
			await ns.corporation.setAutoJobAssignment(div, city, job, assign)
			await ns.sleep(waitTime);
		}
	}
}

export async function assignAllJobs(ns) {
	let corp = ns.corporation.getCorporation();
	let divs = corp.divisions
	for (let i of divs) {
		let cities = ns.corporation.getDivision(i).cities
		for (let j of cities) {
			await assignJobs(ns, i, j, JobDistEven)
		}
	}
}

export function upgradeOffice(ns, div, city, goalEmps) {
	let office = ns.corporation.getOffice(div, city)
	if (office.size >= goalEmps) {
		return;
	} else {
		let exp = Math.min(getMaxHire(ns, div, city), goalEmps - office.size)

		if (isFinite(exp) && exp > 0) {
			ns.print("expanding office ",div," ",city)
			ns.corporation.upgradeOfficeSize(div, city, exp)
		}
	}
}

export async function hireAndAssign(ns, div, city, goalEmps, distribution = [1, 1, 1, 1, 1, 1]) {
	upgradeOffice(ns, div, city, goalEmps)
	hireToMax(ns, div, city)
	await assignJobs(ns, div, city, distribution)
}

export function getUnemployed(ns, div, city) {
	let unemployed = ns.corporation.getOffice(div, city).employeeJobs["Unassigned"];
	return unemployed;
}

export function getMaxHire(ns, div, city) {
	let funds = ns.corporation.getCorporation().funds
	let cost = ns.corporation.getOfficeSizeUpgradeCost(div, city, 1);
	let maxEmps = 6;
	while (funds > cost) {
		cost = ns.corporation.getOfficeSizeUpgradeCost(div, city, maxEmps);
		maxEmps = maxEmps + 6;
		if (maxEmps >= 300) {
			break;
		}
	}
	maxEmps = maxEmps - 12
	return maxEmps
}

export function startWarehouse(ns, division, city) {
	ns.print("Has warehouse? " + division + city + ns.corporation.hasWarehouse(division, city))
	if (ns.corporation.hasWarehouse(division, city) === false) {
		if (ns.corporation.getCorporation().funds > ns.corporation.getConstants().warehouseInitialCost) {
			ns.print("Purchasing warehouse for " + division + " " + city)
			ns.corporation.purchaseWarehouse(division, city);
		}
	}
}


export async function expandCityStaffWarehouse(ns, division) {
	ns.print("ExpandCityStaffWarehouse")
	let existingCities = ns.corporation.getDivision(division).cities;
	for (let i of DivCities) {
		if (!existingCities.includes(i)) {
			ns.print("expanding to city "+division+i)
			ns.corporation.expandCity(division, i);
			existingCities.push(i);
		}
	}
	existingCities = ns.corporation.getDivision(division).cities;
	for (let j of existingCities) {
		await hireAndAssign(ns, division, j, 6, JobDistEven);
		startWarehouse(ns, division, j)
		enableSmartSupply(ns, division, j);
		setSellAtMP(ns, division, j)
		upgradeStorage(ns, division, j, 300);
	}
}

export function setSellAtMP(ns, division, city) {
	ns.print("Set sell at MP materials")
	if (ns.corporation.getCorporation().divisions.indexOf(division) > -1) {
		if (ns.corporation.getDivision(division).cities.indexOf(city) > -1) {
			let materials = MaterialNames.filter(el => ns.corporation.getMaterial(division, city, el).productionAmount > 0);
			ns.print(materials);
			if (materials.length > 0) {
				for (let i of materials) {
					ns.print("Setting sell material " + i + city)
					ns.corporation.sellMaterial(division, city, i, "MAX", "MP")
				}
			}
		}
	}
}

export function updateMaterialPrices(ns, div, city) {
	if (ns.corporation.hasWarehouse(div, city)) {
		let saleableMaterials = AgricultureSellMats;
		for (let j of saleableMaterials) {
			let materialData = ns.corporation.getMaterial(div, city, j)
			let currentPrice = materialData.desiredSellPrice;
			let onHand = materialData.stored;
			let productionQty = materialData.productionAmount
			let price = 1;
			if (isNaN(currentPrice)) {
				if (currentPrice === "MP") {
					price = 1
				} else {
					price = Number(currentPrice.split('MP*')[1]);
				}
			}
			let exportQty = 0;
			for (let k of materialData.exports) {
				exportQty = exportQty + k.amount;
			}
			let wh = ns.corporation.getWarehouse(div, city);
			ns.print("Mat " + j)
			ns.print("sell " + materialData.actualSellAmount)
			ns.print("prod " + materialData.productionAmount)
			ns.print("exp " + exportQty);
			ns.print("oldPrice " + price)
			ns.print(wh.sizeUsed + " / " + wh.size);
			if (materialData.actualSellAmount + exportQty < (materialData.productionAmount) * .95) {
				price = price * .9
			} else {
				price = price * 1.1
			}
			if (ns.corporation.getWarehouse(div, city).sizeUsed >= ns.corporation.getWarehouse(div, city).size * .8) {
				price = price * .9
			}
			ns.print("updated price " + price)
			if (price < 1) { price = 1 };
			ns.corporation.sellMaterial(div, city, j, "MAX", "MP*" + price, false)
		}
	}
}

export function warehouseMonitor(ns) {
	let corp = ns.corporation.getCorporation(ns);
	let mats = [];
	for (let i of corp.divisions) {
		let div = i;
		let cities = ns.corporation.getDivision(div).cities;
		for (let j of cities) {
			let city = j;
			if (ns.corporation.hasWarehouse(div, city)) {
				let wh = ns.corporation.getWarehouse(div, city)

				for (let k of MaterialNames) {
					let mat = ns.corporation.getMaterial(div, city, k);
					mats.push([i, j, k, mat.stored, mat.actualSellAmount, mat.actualSellAmount, mat.exports.amount, wh.sizeUsed, wh.size])
				}
			}
		}
	}
	for (let m of mats) {
		if (m[3] > 0)
			ns.print(m);
	}
}

export function setAllExportIProd(ns) {
	let divisions = ns.corporation.getCorporation().divisions;
	for (let i of divisions) {
		if (ns.corporation.getCorporation().divisions.indexOf(i) > -1) {
			let cities = ns.corporation.getDivision(i).cities;

			for (let j of cities) {
				if (ns.corporation.getDivision(i).cities.indexOf(j) > -1) {
					for (let k of ExportMap) {
						let divs = ns.corporation.getCorporation().divisions
						if (divs.indexOf(k.expDiv) > -1 && divs.indexOf(k.impDiv) > -1) {
							let expCities = ns.corporation.getDivision(k.expDiv).cities
							let impCities = ns.corporation.getDivision(k.impDiv).cities
							if (expCities.indexOf(k.expCity > -1) && impCities.indexOf(k.impCity > -1)) {
								if (!exportExistsCheck(ns, k.expDiv, j, k.impDiv, j, k.material))
									ns.corporation.exportMaterial(k.expDiv, j, k.impDiv, j, k.material, "IPROD*(-1)");
							}
						}
					}
				}
			}
		}
	}
}

export function exportExistsCheck(ns, expDiv, expCity, impDiv, impCity, material) {
	let divs = ns.corporation.getCorporation().divisions
	if (divs.indexOf(expDiv) > -1 && divs.indexOf(impDiv) > -1) {
		let expCities = ns.corporation.getDivision(expDiv).cities
		let impCities = ns.corporation.getDivision(impDiv).cities
		if (expCities.indexOf(expCity > -1) && impCities.indexOf(impCity > -1)) {
			let matExp = ns.corporation.getMaterial(expDiv, expCity, material).exports;
			if (matExp.length > 0) {
				for (let i of matExp) {
					if (i.city === impCity && i.division === impDiv) {
						return true;
					} else {
						continue;
					}
				}
			} else {
				return false;
			}
		}
	}
	return false;
}

export function upgradeStorage(ns, division, city, goal) {
	let warehouse = ns.corporation.getWarehouse(division, city);
	let sizeInc = (goal - warehouse.size);
	if (sizeInc > 0) {
		let numUpgrades = Math.ceil((sizeInc) / (100 + 10 * ns.corporation.getUpgradeLevel("Smart Storage")))
		let cost = ns.corporation.getUpgradeWarehouseCost(division, city, numUpgrades)
		if (getFunds(ns) > cost) {
			ns.print("upgradeStorage: Upgrading Warehouse " + division, city, numUpgrades)
			ns.corporation.upgradeWarehouse(division, city, numUpgrades);
		}
	}
}

export function upgradeStorageOrBuyAds(ns, division, city) {
	let mats = MaterialNames;
	for (let i of mats) {
		let mat = ns.corporation.getMaterial(division, city, i)
		if (mat.productionAmount > mat.actualSellAmount + mat.exports.amount) {
			if (ns.corporation.getCorporation().funds > ns.corporation.getHireAdVertCost(division)) {
				ns.print("Buying Adverts for " + division)
				ns.corporation.hireAdVert(division);
			}
		} else {
			if (ns.corporation.getCorporation().funds > ns.corporation.getUpgradeWarehouseCost(division, city)) {
				ns.print("UpgradeStorageOrBuyAds: Upgrading Warehouse " + division, city)
				ns.corporation.upgradeWarehouse(division, city);
			}
		}
	}
}

export function starterAdVert(ns, division) {
	if (ns.corporation.getHireAdVertCount(division) < 1) {
		ns.print("Hiring advert "+ns.corporation.getHireAdVertCost(division))
		ns.corporation.hireAdVert(division)
	}
}

export function enableSmartSupply(ns) {
	let divs = ns.corporation.getCorporation().divisions;
	for (let i of divs) {
		let cities = ns.corporation.getDivision(i).cities
		for (let j of cities) {
			if (ns.corporation.hasWarehouse(i, j) === true) {
				ns.corporation.setSmartSupply(i, j, true);
			}
		}
	}
}

export function starterUpgrades(ns) {
	let upgrades = ["FocusWires", "Neural Accelerators", "Speech Processor Implants", "Nuoptimal Nootropic Injector Implants", "Smart Factories"]
	for (let i of upgrades) {
		let upgLevel = ns.corporation.getUpgradeLevel(i);
		if (upgLevel < 2) {
			for (let j = 0; j < 2 - upgLevel; j++) {
				if (getFunds(ns) > ns.corporation.getUpgradeLevelCost(i))
					ns.corporation.levelUpgrade(i);
			}
		}
	}
}


export async function corpStartup(ns) {
	if (ns.corporation.hasCorporation() === false) {
		createCorp(ns)
	}
	let divType = "Agriculture"
	let divName = DivNames[divType];
	if (ns.corporation.hasCorporation() === true) {
		expandDivision(ns, divType, divName)
	}
	if (ns.corporation.hasUnlock("Smart Supply") === false) {
		ns.corporation.purchaseUnlock("Smart Supply")
	}
	await expandCityStaffWarehouse(ns, divName);
	starterAdVert(ns, divName);
	starterUpgrades(ns);
}

export function corpInvestCheck(ns, goalAmt, maxRound) {
	let offer = ns.corporation.getInvestmentOffer();
	if (maxRound <= offer.round && goalAmt < offer.funds) {
		ns.corporation.acceptInvestmentOffer()
		ns.tprint("Corporation offer accepted: ",offer.funds," ",round);
		return true;
	}
	return false;
}

export function corpInvest1(ns) {
	let divType = "Agriculture"
	let division = DivNames[divType];
	let existingCities = ns.corporation.getDivision(division).cities;
	for (let i of DivCities) {
		if (!existingCities.includes(i)) {
			ns.corporation.expandCity(division, i);
			existingCities.push(i);
		}
	}
	existingCities = ns.corporation.getDivision(division).cities;
	invest1Upgrades(ns)
	for (let j of existingCities) {
		if (ns.corporation.getOffice(division, j).size < 1) {
			hireAndAssign(ns, division, j, 9, JobDistUpgr);
		}
		upgradeStorage(ns, division, j, 2000);
	}
}

export function invest1Upgrades(ns) {
	let upgrades = ["Smart Factories", "Smart Storage"]
	for (let i of upgrades) {
		let upgLevel = ns.corporation.getUpgradeLevel(i);
		if (upgLevel < 10) {
			for (let j = 0; j < 10 - upgLevel; j++) {
				if (getFunds(ns) > ns.corporation.getUpgradeLevelCost(i))
					ns.corporation.levelUpgrade(i);
			}
		}
	}
}

export function corpInvest2(ns) {
	let divType = "Agriculture"
	let division = DivNames[divType];
	let existingCities = ns.corporation.getDivision(division).cities;
	for (let i of DivCities) {
		if (!existingCities.includes(i)) {
			ns.corporation.expandCity(division, i);
			existingCities.push(i);
		}
	}
	invest1Upgrades(ns)

	existingCities = ns.corporation.getDivision(division).cities;
	for (let j of existingCities) {
		if (ns.corporation.getOffice(division, j).size < 1) {
			hireAndAssign(ns, division, j, 9, JobDistUpgr);
		}
		upgradeStorage(ns, division, j, 3800);
	}
}


export async function bpmForAg(ns, division, agProdMats) {
	let existingCities = ns.corporation.getDivision(division).cities;
	existingCities.sort((a, b) => ns.corporation.getWarehouse(division, a).size - ns.corporation.getWarehouse(division, b).size)
	for (let j of existingCities) {
		for (let k of ProductionMats) {
			//	ns.print(j, agProdMats[k])
			await buyProductionMaterial(ns, division, j, k, agProdMats[k]);
		}
	}
}

export async function buyProductionMaterial(ns, div, city, material, goalQty) {
	let qty = ns.corporation.getMaterial(div, city, material).stored
	//ns.print(material, " ", goalQty, " ", qty)
	if (qty < goalQty) {
		let buyQty = Math.min((goalQty - qty), Math.floor(ns.corporation.getCorporation().funds / ns.corporation.getMaterial(div, city, material).marketPrice))
		let wh = ns.corporation.getWarehouse(div, city);
		//	ns.print(dCorp.MaterialInfo[material].size)
		let sizeRestBuyQty = Math.floor((wh.size * .8 - wh.sizeUsed) / dCorp.MaterialInfo[material].size)
		buyQty = Math.min(buyQty, sizeRestBuyQty)
		//	ns.print(buyQty)
		if (buyQty > 0) {
			ns.print("Buying prod mats " + div, city, material)
			ns.corporation.bulkPurchase(div, city, material, buyQty)
		}
	}
	//ns.print(ns.corporation.getCorporation().funds)
}

export async function tobaccoStartup(ns) {

	if (ns.corporation.hasCorporation() === false) {
		createCorp(ns)
	}
	let divType = "Tobacco"
	let divName = DivNames[divType];
	if (ns.corporation.hasCorporation() === true) {
		expandDivision(ns, divType, divName)
	}
	if (ns.corporation.hasUnlock("Smart Supply") === false) {
		ns.corporation.purchaseUnlock("Smart Supply")
	}
	await expandCityStaffWarehouse(ns, divName);
	starterAdVert(ns, divName);
	starterUpgrades(ns);
}

export async function divStartup(ns, divType) {

	if (ns.corporation.hasCorporation() === false) {
		createCorp(ns)
	}
	let divName = DivNames[divType];
	if (ns.corporation.hasCorporation() === true) {
		expandDivision(ns, divType, divName)
	}
	if (ns.corporation.hasUnlock("Smart Supply") === false) {
		ns.corporation.purchaseUnlock("Smart Supply")
	}
	await expandCityStaffWarehouse(ns, divName);
	starterAdVert(ns, divName);
	starterUpgrades(ns);
}

// ===========Product Management=========

export function getProductStatuses(ns, div) {
	let prods = ns.corporation.getDivision(div).products;

	let completed = prods.filter(el => ns.corporation.getProduct(div, DevCity, el).developmentProgress === 100);
	let inDevelopment = prods.filter(el => ns.corporation.getProduct(div, DevCity, el).developmentProgress < 100)
	let maxProdNo = getMaxProductNumber(ns, div)
	let openSlots = maxProdNo - completed.length - inDevelopment.length;
	return [completed, inDevelopment, openSlots];
}

export function getMaxProductNumber(ns, div) {
	let maxProdNum = 3;
	if (ns.corporation.hasResearched(div, "uPgrade: Capacity.I")) {
		maxProdNum = maxProdNum + 1;
	}
	if (ns.corporation.hasResearched(div, "uPgrade: Capacity.II")) {
		maxProdNum = maxProdNum + 1;
	}
	return maxProdNum;
}

export function discontinueWeakest(ns, div) {
	let prodStatus = getProductStatuses(ns, div);
	let completed = prodStatus[0];
	let weakest = completed[0];
	let weakestQual = ns.corporation.getProduct(div, DevCity, weakest).rat;
	for (let i of completed) {
		if (ns.corporation.getProduct(div, DevCity, i).rat < weakestQual) {
			weakest = completed[0];
			weakestQual = ns.corporation.getProduct(div, DevCity, weakest).rat;
		}
	}
	ns.corporation.discontinueProduct(div, weakest);
}

export function developProduct(ns, div, number) {
	let prods = ns.corporation.getDivision(div).products;
	let funds = getFunds(ns);
	for (let i of ProdNames) {
		if (!prods.includes(i)) {
			ns.print("Developing product " + i)
			ns.corporation.makeProduct(div, DevCity, i, funds / number / 2, funds / number / 2)
			number--;
			if (number === 0) {
				break;
			}
		}
	}
}

export function updateProductPrice(ns, div, product) {
	for (let i of DivCities) {
		if (ns.corporation.hasWarehouse(div,i)) {
			let productData = ns.corporation.getProduct(div, i, product);
			let currentPrice = productData.desiredSellPrice;
			let onHand = productData.qty
			let productionQty = productData.prod
			let price = productData.rating / 100
			if (isNaN(currentPrice)) {
				if (currentPrice === "MP") {
					price = 1
				} else {
					price = Number(currentPrice.split('MP*')[1]);
				}
			}

			if (productData.actualSellAmount <= productData.productionAmount * .95) {
				price = price * .9
			} else {
				price = price * 1.1
			}
			if (ns.corporation.getWarehouse(div, i).sizeUsed >= ns.corporation.getWarehouse(div, i).size * .9) {
				price = price * .9
			}
			if (price < 1) { price = 1 };
			ns.corporation.sellProduct(div, i, product, "MAX", "MP*" + price, false)
		}
	}
}

export function setMarketPrices(ns, div) {
	let prods = ns.corporation.getDivision(div).products;
	for (let i of prods) {
		updateProductPrice(ns, div, i)
		if (ns.corporation.hasResearched(div, "Market-TA.II")) {
			ns.corporation.setProductMarketTA1(div, i, true)
			ns.corporation.setProductMarketTA2(div, i, true)
		}
	}
}


// if completed products === max product number
///discontinue product
// if products in development < (max prod - completed)
///start development of new product
//update prices

export function productTasks(ns, div) {
	let prodStatus = getProductStatuses(ns, div);
	let maxProd = getMaxProductNumber(ns, div)
	let completed = prodStatus[0];
	if (completed.length === maxProd) {
		discontinueWeakest(ns, div);
	}
	prodStatus = getProductStatuses(ns, div);
	completed = prodStatus[0];
	let inDev = prodStatus[1];

	if (completed.length + inDev.length < maxProd) {
		developProduct(ns, div, prodStatus[2]);
	}
	setMarketPrices(ns, div);
}


//===========Office & Warehouse Management==========
export async function expandOffice(ns, division) {
	let existingCities = ns.corporation.getDivision(division).cities;
	let goalEmps = 30;
	for (let j of existingCities) {
		if (j === DevCity) {
			goalEmps = 300;
		} else {
			goalEmps = (ns.corporation.getOffice(division, DevCity).size - 60)
		}
		await hireAndAssign(ns, division, j, goalEmps, JobDistEven);
	}
}

export function getMaxAdVerts(ns, div) {
	let funds = ns.corporation.getCorporation().funds
	let cost = ns.corporation.getHireAdVertCost(div)
	let advertCount = Math.floor(funds / cost)
	return advertCount;
}

export async function purchaseProdMats(ns, division) {
	let existingCities = ns.corporation.getDivision(division).cities;
	for (let i of existingCities) {
		let warehouse = ns.corporation.getWarehouse(division, i);
		if (warehouse.sizeUsed / warehouse.size < .5) {
			for (let j of ProductionMats) {
				let agSize = (dCorp.MaterialInfo[j].size)
				let totQty = Math.floor(warehouse.size / 2 * AgProdMatPerc[j] / agSize)
				await buyProductionMaterial(ns, division, i, j, totQty);
			}

		}
	}
}

export function expandWarehouses(ns, division) {
	let existingCities = ns.corporation.getDivision(division).cities;
	existingCities.sort((a, b) => ns.corporation.getWarehouse(division, a).size - ns.corporation.getWarehouse(division, b).size)
	for (let i of existingCities) {
		let warehouse = ns.corporation.getWarehouse(division, i);
		if (warehouse.sizeUsed / warehouse.size > .8) {
			if (ns.corporation.getUpgradeWarehouseCost(division, i) < ns.corporation.getCorporation().funds) {
				ns.print("ExpandWarehouse:Upgrading warehouse " + division, i)
				ns.corporation.upgradeWarehouse(division, i);
			}
		}
	}
}

//============upgrades=============

export function getCheapestUpgradeCost(ns) {
	let lowestCost = ns.corporation.getUpgradeLevelCost(UpgradeList[0]);
	let cheapestUpgrade = UpgradeList[0]
	for (let h of UpgradeList) {
		if (ns.corporation.getUpgradeLevelCost(h) < lowestCost) {
			lowestCost = ns.corporation.getUpgradeLevelCost(h);
			cheapestUpgrade = h;
		}
	}
	return lowestCost;
}

export function buyAllUpgrades(ns) {
	let funds = getFunds(ns);
	let lowestCost = getCheapestUpgradeCost(ns);
	let counter = 0;
	while (funds > lowestCost) {
		if (counter > 1000) {
			break;
		}
		for (let i of UpgradeList) {
			funds = getFunds(ns);

			if (ns.corporation.getUpgradeLevelCost(i) < funds) {
				ns.print("Purchasing upgrade " + i)
				ns.corporation.levelUpgrade(i);
				funds = getFunds(ns);
			}
			lowestCost = getCheapestUpgradeCost(ns);
			if (funds < lowestCost) {
				break;
			}

		}
		funds = getFunds(ns);
		lowestCost = getCheapestUpgradeCost(ns);
		counter++
	}
}


export function buyAdVerts(ns, division) {
	let funds = getFunds(ns)
	let cost = ns.corporation.getHireAdVertCost(division);
	let counter = 0;
	while (funds > cost) {
		if (counter > 1000) {
			break;
		}
		if (ns.corporation.getHireAdVertCost(division) < funds) {
			ns.print("Buying adverts for " + division)
			ns.corporation.hireAdVert(division)
		} else {
			break;
		}
		funds = getFunds(ns)
		cost = ns.corporation.getHireAdVertCost(division)
		counter++;
	}
}

//===========Stock Buyback and Rep Donations=========
export function repDonations(ns) {
	let augsList = hAugs.getAllAugs(ns, Object.values(FactionNames), hAugs.AllStats);
	//ns.print(augsList)
	for (let i of augsList) {
		donateToRep(ns, i.aName, i.aFaction);
	}
}

export function donateToRep(ns, aug, faction) {
	let playerFactions = ns.getPlayer().factions;
	if (playerFactions.includes(faction)) {
		//	ns.print(aug, faction)
		let neededRep = ns.singularity.getAugmentationRepReq(aug) - ns.singularity.getFactionRep(faction)
		let bribePerRep = 1e9
		if (neededRep > 0) {
			let amt = bribePerRep * neededRep;
			ns.corporation.bribe(faction, amt)
		}
	}
}

export function buyBackAllShares(ns) {
	let corpInfo = ns.corporation.getCorporation()
	let availShares = corpInfo.issuedShares;
	let funds = ns.getServerMoneyAvailable("home") / 10;
	let sharePrice = corpInfo.sharePrice;
	let affordableShares = Math.floor(funds / sharePrice);
	let amt = Math.min(availShares, affordableShares)
	if (amt > 0) {
		ns.corporation.buyBackShares(amt)
	}
}

export const CorpName = "BPCorp"
export const DivNames = { "Agriculture": "FishFarm", "Tobacco": "PuffinPuffin", "Chemical": "CompostBin" }
export const DivCities = ["Sector-12", "Aevum", "Chongqing", "Ishima", "New Tokyo", "Volhaven"]
export const DivInfo = [
	{
		divType: "Agriculture",
		divName: "FishFarm",
		divMatsCons: ["Chemicals", "Water"],
		divMatsProd: ["Plants", "Food"],
	},
	{
		divType: "Tobacco",
		divName: "PuffinPuffin",
		divMatsCons: ["Plants"],
		divMatsProd: [],
	},
	{
		divType: "Chemical",
		divName: "CompostHeap",
		divMatsCons: ["Plants"],
		divMatsProd: ["Chemicals"],
	}
]
export const Jobs = ["Operations", "Engineer", "Business", "Management", "Research & Development", "Intern"]
export const JobDistStart = [1, 1, 1]
export const JobDistUpgr = [1, 1, 1, 1, 1, 1]
export const JobDistEven = [1, 1, 1, 1, 1, 1]
export const JobDistMfg = []
export const JobDistSales = []
export const AgricultureSellMats = ["Food", "Plants"]
export const ChemicalSellMats = ["Chemicals"]
export const ExportMap = [
	{
		expDiv: DivNames["Agriculture"],
		material: "Plants",
		impDiv: DivNames["Chemical"]
	},
	{
		expDiv: DivNames["Agriculture"],
		material: "Plants",
		impDiv: DivNames["Tobacco"]
	},
	{
		expDiv: DivNames["Chemical"],
		material: "Chemicals",
		impDiv: DivNames["Agriculture"]
	}
]
export const ProductionMats = ["Hardware", "Robots", "AI Cores", "Real Estate"]
export const AgProdMat1 = { "Hardware": 125, "Robots": 0, "AI Cores": 75, "Real Estate": 27000 }
export const AgProdMat2 = { "Hardware": 2800, "Robots": 96, "AI Cores": 2520, "Real Estate": 146400 }
export const AgProdMat3 = { "Hardware": 9300, "Robots": 726, "AI Cores": 6270, "Real Estate": 230400 }
export const AgProdMatPerc = { "Hardware": 0.3, "Robots": 0.2, "AI Cores": 0.2, "Real Estate": 0.3 }
export const ProdNames = ["T1", "T2", "T3", "T4", "T5"]
export const UpgradeList = [
	"Smart Factories",
	"Smart Storage",
	"DreamSense",
	"Wilson Analytics",
	"Nuoptimal Nootropic Injector Implants",
	"Speech Processor Implants",
	"Neural Accelerators",
	"FocusWires",
	"ABC SalesBots",
	"Project Insight"
]
export const DevCity = "Sector-12"
export const MaterialNames = [
	"Minerals",
	"Ore",
	"Water",
	"Food",
	"Plants",
	"Metal",
	"Hardware",
	"Chemicals",
	"Drugs",
	"Robots",
	"AI Cores",
	"Real Estate"
]



export async function main(ns) {
	corpInvestCheck(ns, 210e9, 1)

}