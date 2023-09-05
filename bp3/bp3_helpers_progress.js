/** @param {NS} ns */
//get daedalus access
//--hack level
//--money
//--aug count
//join daedalus
//get red pill rep
//purchase red pill
//reset
//get world hack skill
//hack world

function flightCheck(ns) {
	if(ns.getPlayer().factions.indexOf("Daedalus")>-1) {
		ns.toast("Already part of Daedalus "+ns.formatNumber(ns.singularity.getFactionRep("Daedalus"),"0.00a" ))
			return true;
	}
	if(ns.singularity.checkFactionInvitations().indexOf("Daedalus")>-1) {
		ns.toast("Have Daedalus invite") 
			return true;
	}
		if(ns.getHackingLevel()>2500) {
			if(ns.getServerMoneyAvailable("home")>100e9) {
				if(ns.getOwnedAugmentations(false).length > 30) {
					ns.toast("Daedalus ready!")
					return true;
				} else {
					if(ns.getOwnedAugmentations(true).length > 30) {
					ns.toast("install augs") 
					return false;
					} else {
						ns.toast("Need more augs")
						return false;
					}
				}
			} else {
				ns.toast("Need more money")
				return false;
			}
		} else {
			ns.toast("Need more Daedalus rep")
			return false;
		}
}

function redPillCheck(ns) {
	if(ns.singularity.getOwnedAugmentations(true).indexOf("The Red Pill")>-1) {
		return true;
	}
	return false;
}




export async function main(ns) {
flightCheck(ns)
}