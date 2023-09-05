/** @param {NS} ns */
export const SkillNames = {
  BladesIntuition: "Blade's Intuition",
  Cloak: "Cloak",
  Marksman: "Marksman",
  WeaponProficiency: "Weapon Proficiency",
  ShortCircuit: "Short-Circuit",
  DigitalObserver: "Digital Observer",
  Tracer: "Tracer",
  Overclock: "Overclock",
  Reaper: "Reaper",
  EvasiveSystem: "Evasive System",
  Datamancer: "Datamancer",
  CybersEdge: "Cyber's Edge",
  HandsOfMidas: "Hands of Midas",
  Hyperdrive: "Hyperdrive",
};

export const Skills = {};

export class Skill {
	constructor(name,desc) {
  this.name = name;
  this.desc = desc;
  // Cost is in Skill Points
  baseCost = 1;
  // Additive cost increase per level
  costInc = 1;
  maxLvl = 0;

  /**
   * These benefits are additive. So total multiplier will be level (handled externally) times the
   * effects below
   */
  successChanceAll = 0;
  successChanceStealth = 0;
  successChanceKill = 0;
  successChanceContract = 0;
  successChanceOperation = 0;

  /**
   * This multiplier affects everything that increases synthoid population/community estimate
   * e.g. Field analysis, Investigation Op, Undercover Op
   */
  successChanceEstimate = 0;
  actionTime = 0;
  effHack = 0;
  effStr = 0;
  effDef = 0;
  effDex = 0;
  effAgi = 0;
  effCha = 0;
  stamina = 0;
  money = 0;
  expGain = 0;

  constructor(params = { name: "foo", desc: "foo" }) {
    if (!params.name) {
      throw new Error("Failed to initialize Bladeburner Skill. No name was specified in ctor");
    }
    if (!params.desc) {
      throw new Error("Failed to initialize Bladeburner Skills. No desc was specified in ctor");
    }
    this.name = params.name;
    this.desc = params.desc;
    this.baseCost = params.baseCost ? params.baseCost : 1;
    this.costInc = params.costInc ? params.costInc : 1;

    if (params.maxLvl) {
      this.maxLvl = params.maxLvl;
    }

    if (params.successChanceAll) {
      this.successChanceAll = params.successChanceAll;
    }
    if (params.successChanceStealth) {
      this.successChanceStealth = params.successChanceStealth;
    }
    if (params.successChanceKill) {
      this.successChanceKill = params.successChanceKill;
    }
    if (params.successChanceContract) {
      this.successChanceContract = params.successChanceContract;
    }
    if (params.successChanceOperation) {
      this.successChanceOperation = params.successChanceOperation;
    }

    if (params.successChanceEstimate) {
      this.successChanceEstimate = params.successChanceEstimate;
    }

    if (params.actionTime) {
      this.actionTime = params.actionTime;
    }
    if (params.effHack) {
      this.effHack = params.effHack;
    }
    if (params.effStr) {
      this.effStr = params.effStr;
    }
    if (params.effDef) {
      this.effDef = params.effDef;
    }
    if (params.effDex) {
      this.effDex = params.effDex;
    }
    if (params.effAgi) {
      this.effAgi = params.effAgi;
    }
    if (params.effCha) {
      this.effCha = params.effCha;
    }

    if (params.stamina) {
      this.stamina = params.stamina;
    }
    if (params.money) {
      this.money = params.money;
    }
    if (params.expGain) {
      this.expGain = params.expGain;
    }
  }

  getMultiplier(name) {
    if (name === "successChanceAll") return this.successChanceAll;
    if (name === "successChanceStealth") return this.successChanceStealth;
    if (name === "successChanceKill") return this.successChanceKill;
    if (name === "successChanceContract") return this.successChanceContract;
    if (name === "successChanceOperation") return this.successChanceOperation;
    if (name === "successChanceEstimate") return this.successChanceEstimate;

    if (name === "actionTime") return this.actionTime;

    if (name === "effHack") return this.effHack;
    if (name === "effStr") return this.effStr;
    if (name === "effDef") return this.effDef;
    if (name === "effDex") return this.effDex;
    if (name === "effAgi") return this.effAgi;
    if (name === "effCha") return this.effCha;

    if (name === "stamina") return this.stamina;
    if (name === "money") return this.money;
    if (name === "expGain") return this.expGain;
    return 0;
  }
}

function () {
	 Skills[SkillNames.Cloak] = {
    name: SkillNames.Cloak,
    desc: "Each level of this skill increases your success chance for all Contracts, Operations, and BlackOps by 3%",
    baseCost: 3,
    costInc: 2.1,
    successChanceAll: 3,
  },
  Skills[SkillNames.Cloak] = {
    name: SkillNames.Cloak,
    desc:
      "Each level of this skill increases your " +
      "success chance in stealth-related Contracts, Operations, and BlackOps by 5.5%",
    baseCost: 2,
    costInc: 1.1,
    successChanceStealth: 5.5,
  }
  Skills[SkillNames.ShortCircuit] = new Skill({
    name: SkillNames.ShortCircuit,
    desc:
      "Each level of this skill increases your success chance " +
      "in Contracts, Operations, and BlackOps that involve retirement by 5.5%",
    baseCost: 2,
    costInc: 2.1,
    successChanceKill: 5.5,
  });
  Skills[SkillNames.DigitalObserver] = new Skill({
    name: SkillNames.DigitalObserver,
    desc: "Each level of this skill increases your success chance in all Operations and BlackOps by 4%",
    baseCost: 2,
    costInc: 2.1,
    successChanceOperation: 4,
  });
  Skills[SkillNames.Tracer] = new Skill({
    name: SkillNames.Tracer,
    desc: "Each level of this skill increases your success chance in all Contracts by 4%",
    baseCost: 2,
    costInc: 2.1,
    successChanceContract: 4,
  });
  Skills[SkillNames.Overclock] = new Skill({
    name: SkillNames.Overclock,
    desc:
      "Each level of this skill decreases the time it takes " +
      "to attempt a Contract, Operation, and BlackOp by 1% (Max Level: 90)",
    baseCost: 3,
    costInc: 1.4,
    maxLvl: 90,
    actionTime: 1,
  });
  Skills[SkillNames.Reaper] = new Skill({
    name: SkillNames.Reaper,
    desc: "Each level of this skill increases your effective combat stats for Bladeburner actions by 2%",
    baseCost: 2,
    costInc: 2.1,
    effStr: 2,
    effDef: 2,
    effDex: 2,
    effAgi: 2,
  });
  Skills[SkillNames.EvasiveSystem] = new Skill({
    name: SkillNames.EvasiveSystem,
    desc: "Each level of this skill increases your effective dexterity and agility for Bladeburner actions by 4%",
    baseCost: 2,
    costInc: 2.1,
    effDex: 4,
    effAgi: 4,
  });
  Skills[SkillNames.Datamancer] = new Skill({
    name: SkillNames.Datamancer,
    desc:
      "Each level of this skill increases your effectiveness in " +
      "synthoid population analysis and investigation by 5%. " +
      "This affects all actions that can potentially increase " +
      "the accuracy of your synthoid population/community estimates.",
    baseCost: 3,
    costInc: 1,
    successChanceEstimate: 5,
  });
  Skills[SkillNames.CybersEdge] = new Skill({
    name: SkillNames.CybersEdge,
    desc: "Each level of this skill increases your max stamina by 2%",
    baseCost: 1,
    costInc: 3,
    stamina: 2,
  });
  Skills[SkillNames.HandsOfMidas] = new Skill({
    name: SkillNames.HandsOfMidas,
    desc: "Each level of this skill increases the amount of money you receive from Contracts by 10%",
    baseCost: 2,
    costInc: 2.5,
    money: 10,
  });
  Skills[SkillNames.Hyperdrive] = new Skill({
    name: SkillNames.Hyperdrive,
    desc: "Each level of this skill increases the experience earned from Contracts, Operations, and BlackOps by 10%",
    baseCost: 1,
    costInc: 2.5,
    expGain: 10,
  });


export async function main(ns) {

}