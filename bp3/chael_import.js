let config = {
  folder: 'script',
  rootUrl: 'https://raw.githubusercontent.com/Garfunklette/BitBurner/main/',
  serverPrefix: 'purch',
};
/*
 * This will import all files listed in importFiles.
 */
export async function main(ns) {
  let filesImported = await importFiles(ns);
  ns.tprint('='.repeat(20));
  if (filesImported) {
    ns.tprint('Hey! Thank you for downloading the BitBurner Scripts.');
    ns.tprint(`You've installed these in the ${config.folder} directory.`);
    ns.tprint(
      `A good place to start is running \`run /${config.folder}/hax.js\``
    );
  } else {
    ns.tprint(
      'You had some issues downloading files, please reach out to the repo maintainer or check your config.'
    );
  }
}

async function importFiles(ns) {
  let files = ['bp3_augs_augStats.js','bp3_augs_nfg.js','bp3_augs_purchase.js','bp3_bb_augs.js','bp3_bb_blackOps.js','bp3_bb_manager.js','bp3_bb_sleeves.js','bp3_contract_generateDummy.js','bp3_contract_getContractDescription.js','bp3_contract_getList.js','bp3_contract_solveAll.js','bp3_contract_solvers.js','bp3_contract_solverTesting.js','bp3_corp_bribes.js','bp3_corp_divisionStartup.js','bp3_corp_getInvestors.js','bp3_corp_invest1.js','bp3_corp_invest2.js','bp3_corp_manager.js','bp3_corp_marketAI.js','bp3_corp_products.js','bp3_corp_purchaseProdMaterials.js','bp3_corp_scpManager.js','bp3_corp_start.js','bp3_corp_waitForInvestors.js','bp3_crime_doBest.js','bp3_crime_getBest.js','bp3_data_bb.js','bp3_data_corporation.js','bp3_data_factions.js','bp3_data_literatureNames.js','bp3_data_locationNames.js','bp3_data_servers.js','bp3_data_stocks.js','bp3_doNotUse.js','bp3_factions_joinAll.js','bp3_graft_augList.js','bp3_grow.js','bp3_hack.js','bp3_hacking_allInOne.js','bp3_hacking_batch.js','bp3_hacking_batchDaemon.js','bp3_hacking_batchManager.js','bp3_hacking_bN00dles.js','bp3_hacking_loop.js','bp3_hacking_manager.js','bp3_hacking_managerManager.js','bp3_hacking_prepBatch.js','bp3_hacking_rootAll.js','bp3_hacking_simple.js','bp3_hacking_weakenJoesGuns.js','bp3_hacknet_manager.js','bp3_hacknet_sellAllHashes.js','bp3_hacknet_study.js','bp3_helpers_augs.js','bp3_helpers_bb.js','bp3_helpers_corp.js','bp3_helpers_factions.js','bp3_helpers_hacking.js','bp3_helpers_hacknet.js','bp3_helpers_monitors.js','bp3_helpers_player.js','bp3_helpers_ports.js','bp3_helpers_progress.js','bp3_helpers_pservers.js','bp3_helpers_purchase.js','bp3_helpers_scripts.js','bp3_helpers_servers.js','bp3_helpers_sleeves.js','bp3_helpers_stock.js','bp3_helpers_terminal.js','bp3_monitors_augs.js','bp3_monitors_corp.js','bp3_monitors_hackTargets.js','bp3_monitors_networth.js','bp3_monitors_ports.js','bp3_monitors_server.js','bp3_player_crime.js','bp3_player_info.js','bp3_player_manager.js','bp3_player_train.js','bp3_player_university.js','bp3_player_workForCompany.js','bp3_player_workForFaction.js','bp3_progress_bnStart.js','bp3_progress_hacknet.js','bp3_progress_install.js','bp3_progress_manager.js','bp3_progress_programming.js','bp3_progress_restart.js','bp3_progress_tor.js','bp3_progress_upgradeHome.js','bp3_pservers_affordable.js','bp3_pservers_deleting.js','bp3_pservers_list.js','bp3_pservers_mgr.js','bp3_pservers_purchase.js','bp3_purchaseList.txt','bp3_servers_connectToServer.js','bp3_servers_homeManager.js','bp3_servers_path.js','bp3_servers_upgradeHome.js','bp3_sleeves_bb.js','bp3_sleeves_crime.js','bp3_sleeves_manager.js','bp3_sleeves_purchaseAugs.js','bp3_sleeves_university.js','bp3_stock_start.js','bp3_stocks_4SManager.js','bp3_stocks_batch_canRemove.js','bp3_stocks_grow_canRemove.js','bp3_stocks_sellAll.js','bp3_test_canvas.js','bp3_test_hacking.js','bp3_weaken.js','gx_textTransforms.js','hm_stocks_stock-master.js','i3_customStats.js'];
  let filesImported = true;
  for (let file of files) {
    let remoteFileName = `${config.rootUrl}bp3/${file}`;
  ns.print(remoteFileName);
    let result = await ns.wget(remoteFileName, `/${getFolder()}/${file}`);
    filesImported = filesImported && result;
    ns.tprint(`File: ${file}: ${result ? '✔️' : '❌'}`);
  }
  return filesImported;
}

export function getFolder() {
  return config.folder;
}

export function getServerPrefix() {
  return config.serverPrefix;
}

export function getHackScript() {
  return `/${getFolder()}/hack.js`;
}
