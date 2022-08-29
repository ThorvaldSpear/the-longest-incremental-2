import { app } from "./index.js";
import { load } from "./utils/saveload.js";
import { ver } from "./utils/version.js";

import { DATA } from "./tmp.js";
import { initTabs } from "./components/tabs.js";
import { RESOURCES } from "./components/resources.js";
import { setupData } from "./tmp.js";
import { reactive } from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";
import { initQuarry } from "./features/0-quarry/quarry.js";
import { doMine } from "./features/0-quarry/miners.js";

// not going to work
// computed() requires reactive source
export let player = (window.player = reactive(setupPlayer()));

/**
 * Returns inital player data.
 */
export function setupPlayer() {
  return {
    gp: {
      upg: {}
    },
    miners: {
      amt: {}
    },
    quarry: initQuarry(),

    ver: ver,
    lastTick: Date.now(),
    stats: {
      time: 0,
      max: 0,
      history: [], //for global history

      hits: 0,
      mined: 0
    },
    options: {}
  };
}

/**
 * Fixes player.
 */
export function fixPlayer(obj) {}

/**
 * Loads and runs the game.
 */
export let interval;
export function loadGame() {
  initTabs();
  load();
  setupData();
  app.mount("#app");
  interval = setInterval(runGame, 50);
}

export function runGame() {
  const diff = (Date.now() - player.lastTick) / 1000;
  player.lastTick = Date.now();

  doMine(diff);
  for (let [index, key] of Object.entries(RESOURCES))
    key.add(DATA.resources[index].prod.value.mul(diff));
}
