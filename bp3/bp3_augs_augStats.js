/** @param {NS} ns */
export async function main(ns) {



let aug = ns.args[0]||ns.singularity.getAugmentationStats("DataJack")
ns.print(aug)

}
