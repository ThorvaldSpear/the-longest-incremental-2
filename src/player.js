import { reactive } from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";
import { app } from "./index.js";
import { setupVue } from "./setup.js";
import { DATA, setupData, TICK_DATA } from "./tmp.js";

import { load, hardReset, save } from "./utils/saveload.js";
import { ver } from "./utils/version.js";

import { initTabs } from "./components/tabs.js";
import { RESOURCES } from "./components/resources.js";
import { achInterval } from "./components/achs.js";
import { isDev } from "./dev.js";

import { initQuarry, getQuarryDepth } from "./features/0-quarry/quarry.js";
import { tickNews } from "./components/news-ticker.js";
import Decimal from "./utils/break_eternity.js";

// not going to work
// computed() requires reactive source
export const player = reactive(setupPlayer());
if (isDev) {
  window.player = player;
  window.DATA = DATA;
  window.ver = ver
}

/**
 * Returns inital player data.
 */
export function setupPlayer() {
  return {
    gp: {
      upg: {}
    },
    inventory: {
      map: []
    },
    miners: {
      amt: {},
      used: {},
      manualCooldown: 0
    },
    quarry: initQuarry(),

    ver: ver,
    lastTick: Date.now(),
    ach: [],
    hyperAch: [],
    stats: {
      time: 0,
      max: 0,
      history: [], //for global history

      hits: 0,
      mined: 0,
      treasures: 0,

      mapRows: new Decimal(0)
    },
    options: {
      off: true,
      news: true,
      icons: ""
    }
  };
}

/**
 * Determines end-game.
 */
export function gameEnded() {
  return getQuarryDepth().gte(100);
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
  setupData();
  load();
  fixPlayer(player);
  app.mount("#app");
  interval = setInterval(runGame, 50);
  setInterval(achInterval, 1000);
  setInterval(tickNews, 50);
}

export function runGame() {
  const diff = (Date.now() - player.lastTick) / 1000;
  player.lastTick = Date.now();

  player.stats.max = DATA.resources.greenPaper.amt.value.max(player.stats.max);
  player.stats.time += diff;

  for (const tick of Object.values(TICK_DATA)) tick(diff);
  for (let [index, key] of Object.entries(RESOURCES))
    key.add(DATA.resources[index].prod.value.mul(diff));

  tickNews();
}

/**
 * DOM STUFF
 */
setupVue.end = {
  template: `<div>
    <h1>Congratulations! You have reached the end!</h1><br />

    <b style="color: gold">The long hike is over. If you didn't use a guide, you are a no-lifer.</b><br />
    You've beaten the game... for now, at least.<br>
    Check the Discord server to see if there are more updates!<br>
    <button href="https://discord.gg/fcEXYjPQ43" target="_blank">Discord</button>
    
    <button @click="hardReset()">Play Again</button>
    <button @click="player.won = true">Keep Going</button>
  </div>`,
  setup() {
    return {
      player,
      hardReset
    };
  }
};

document.addEventListener(
  "keydown",
  function (e) {
    if (
      (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
      e.keyCode === 83
    ) {
      e.preventDefault();
      save(true);
    }
  },
  false
);
