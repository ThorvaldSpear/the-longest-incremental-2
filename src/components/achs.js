import { D } from "../utils/break_eternity.js";
import { notify } from "../utils/notify.js";

import { player } from "../player.js";
import { DATA } from "../tmp.js";
import { hasUpgrade } from "./buyables.js";
import { setupVue } from "../setup.js";
import { TABS } from "./tabs.js";

/**
 * Class for Achievements.
 */
export class Achievement {
  /**
   *
   * @param {object} data An object containing achievement data.
   * @param {string} data.title Achievement title, appears on the achievement.
   * @param {string} data.tooltip Achievement tooltip, shown when you hover the achievement.
   * @param {computed<boolean>} data.condition A computed function returning boolean indicating whenever you can get the achievement or no.
   * @param {() => void} data.onGive A function that will be called when you get this achievement.
   */
  constructor({ id, title, tooltip, condition, onGive }) {
    this.id = id;
    this.title = title;
    this.tooltip = tooltip;
    this.condition = condition;
    this.onGive = onGive ?? function () {};

    ACH_ROWS = Math.max(ACH_ROWS, Math.ceil(id / 10));
  }

  /*
   * Returns an boolean whether a player has this achievement.
   */
  has() {
    return player.ach.includes(this.id);
  }

  /**
   * Gives this achievement to the player.
   * @param {boolean} force Whenever to ignore achievement requirmento or no.
   */
  give(force = false) {
    if (this.has()) return;
    if (!force && !this.condition()) return;

    notify("Achievement got! " + this.title);
    player.ach.push(this.id);
    this.onGive();
  }
}

let ACH_ROWS = 0;
let ACH_LIST = [
  new Achievement({
    id: 0,
    title: "Welcome!",
    tooltip: "Start this game.",
    condition: () => true
  }),
  new Achievement({
    id: 1,
    title: "Your First Gem!",
    tooltip: "Obtain 1 Bronze.",
    condition: () => DATA.resources.bronze.amt.value.gte(1)
  }),
  new Achievement({
    id: 2,
    title: "Digging the Surface",
    tooltip: "Reach Quarry Depth 5.",
    condition: () => D(player.quarry.depth).gte(5)
  }),
  new Achievement({
    id: 3,
    title: "Upgraded",
    tooltip: "Spend your first Green Papers for an Upgrade.",
    condition: () => hasUpgrade("GreenPapers", 0)
  }),
  new Achievement({
    id: 4,
    title: "Money Bag",
    tooltip: "Get 1,000 Green Papers.",
    condition: () => DATA.resources.greenPaper.amt.value.gte(1e3)
  }),
  new Achievement({
    id: 5,
    title: "Treasure Hunter!",
    tooltip: "Obtain a Treasure.",
    condition: () => player.stats.treasures > 0
  }),
  new Achievement({
    id: 6,
    title: "Hard Hitter",
    tooltip: "Hit 10,000 Blocks.",
    condition: () => D(player.stats.hits).gte(1e4)
  }),
  new Achievement({
    id: 7,
    title: "Map Clear",
    tooltip: "Clear an Row in a Map.",
    condition: () => player.stats.mapRows > 0
  }),
  new Achievement({
    id: 8,
    title: "Millionaire",
    tooltip: "Get 1.00 M Green Papers.",
    condition: () => DATA.resources.greenPaper.amt.value.gte(1e6)
  }),
  new Achievement({
    id: 9,
    title: "Billionaire",
    tooltip: "Get 1.00 B Green Papers.",
    condition: () => DATA.resources.greenPaper.amt.value.gte(1e9)
  })
  /*9: new Achievement({
    id: 9,
    title: "Into the Deep",
    tooltip: "Reach Quarry Depth 100.",
    condition: () => D(player.quarry.depth).gte(100)
  })*/
];

export function achInterval() {
  for (const ach of ACH_LIST) ach.give();
}

TABS.Achievements = {
  component: {
    template: `<div>
      Achievements: {{ACH_GOT}} / {{ACH_COUNT}} ({{(ACH_GOT / ACH_COUNT * 100).toFixed(2)}}%)
      <table>
        <tr v-for="row in ACH_ROWS">
          <td v-for="col in 10">
            <ach :ach-id="(row - 1) * 10 + (col - 1)"/>
          </td>
        </tr>
      </table>
    </div>`,
    setup() {
      return {
        ACH_ROWS,
        ACH_COUNT: ACH_LIST.length,
        ACH_GOT: player.ach.length
      };
    }
  }
};

// DOM
setupVue.ach = {
  props: [`achId`],
  template: `<div v-if="ach"
  :class="{
    ach: true,
    tooltip: true,
    incomplete: !ach.has(), 
    completed: ach.has()
  }">
    {{ach.title}}
    <span class="tooltiptext">{{ach.tooltip}}</span>
  </div>`,
  setup(props) {
    return {
      ach: ACH_LIST[props.achId]
    };
  }
};
