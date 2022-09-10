import { D } from "../utils/break_eternity.js";
import { notify } from "../utils/notify.js";

import { player } from "../player.js";
import { DATA } from "../tmp.js";
import { getUpgrade } from "./buyables.js";
import { setupVue } from "../setup.js";
import { TABS } from "./tabs.js";
import { layerGot } from "./layer.js";
import { format } from "../utils/format.js";

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
   * @param {computed<boolean>} data.hyperCondition A computed function returning boolean indicating whenever you can get the hyper achievement or no.
   * @param {() => void} data.onGive A function that will be called when you get this achievement.
   */
  constructor({
    id,
    title,
    progress,
    condition,
    conditionText,
    hyperCondition,
    hyperConditionText,
    onGive
  }) {
    this.id = id;
    this.title = title;
    this.progress = progress;

    this.condition = condition;
    if (progress) {
      this._condition = condition;
      this.condition = () => D(progress()).div(condition());
    }
    this.conditionText = conditionText;

    this.hyperCondition = hyperCondition;
    if (hyperCondition && progress) {
      this._hyperCondition = hyperCondition;
      this.hyperCondition = () => D(progress()).div(hyperCondition());
    }
    this.hyperConditionText = hyperConditionText;

    this.onGive = onGive ?? function () {};

    ACH_ROWS = Math.max(ACH_ROWS, Math.ceil(id / 10));
  }

  /*
   * Returns an boolean whether a player has this achievement.
   */
  has() {
    return player.ach.includes(this.id);
  }
  hyperHas() {
    return player.hyperAch.includes(this.id);
  }

  /**
   * Gives this achievement to the player.
   * @param {boolean} force Whenever to ignore achievement requirment or no.
   * @param {boolean} hyperForce Whenever to ignore hyper achievement requirment or no.
   */
  give(force = false, hyperForce = false) {
    if (this.hyperHas()) return;
    if (hyperForce || Number(this.hyperCondition?.()) >= 1) {
      notify("Achievement hyperfied! " + this.title);
      player.hyperAch.push(this.id);
    }

    if (this.has()) return;
    if (!force && Number(this.condition()) < 1) return;

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
    progress: () => player.stats.time / 60,
    condition: () => 0,
    conditionText: "Start this game.",
    hyperCondition: () => 45,
    hyperConditionText: "Play this game for 45 minutes."
  }),
  new Achievement({
    id: 1,
    title: "Your First Gem!",
    condition: () => DATA.resources.bronze.amt.value.div(1),
    conditionText: "Obtain 1 Bronze.",
    hyperCondition: () => DATA.resources.platinum.amt.value.div(1),
    hyperConditionText: "Obtain 1 Platinum."
  }),
  new Achievement({
    id: 2,
    title: "Digging the Surface",
    progress: () => player.quarry.depth,
    condition: () => 5,
    conditionText: "Reach Quarry Depth 5.",
    hyperCondition: () => 80,
    hyperConditionText: "Reach Quarry Depth 80."
  }),
  new Achievement({
    id: 3,
    title: "Upgraded",
    progress: () => getUpgrade("GreenPapers", 0).amt,
    condition: () => 1,
    conditionText: "Spend your first Green Papers for an Upgrade.",
    hyperCondition: () => 50,
    hyperConditionText: "Fully upgrade your first Upgrade."
  }),
  new Achievement({
    id: 4,
    title: "Money Bag",
    progress: () => DATA.resources.greenPaper.amt.value,
    condition: () => 1e3,
    conditionText: "Get 1,000 Green Papers.",
    hyperCondition: () => 1e30,
    hyperConditionText: "Get 1.00 N Green Papers."
  }),
  new Achievement({
    id: 5,
    title: "Treasure Hunter!",
    tooltip: "Obtain a Treasure.",
    progress: () => player.stats.treasures,
    condition: () => 1,
    conditionText: "Obtain a Treasure.",
    hyperCondition: () => 25,
    hyperConditionText: "Obtain 25 Treasures."
  }),
  new Achievement({
    id: 6,
    title: "Hard Hitter",
    progress: () => player.stats.hits,
    condition: () => 1e4,
    conditionText: "Hit 10,000 Blocks.",
    hyperCondition: () => 2.5e5,
    hyperConditionText: "Hit 250,000 Blocks."
  }),
  new Achievement({
    id: 7,
    title: "Map Clear",
    progress: () => player.stats.mapRows,
    condition: () => 1,
    conditionText: "Clear a Row in a Map.",
    hyperCondition: () => 250,
    hyperConditionText: "Clear 250 Rows in a Map."
  }),
  new Achievement({
    id: 8,
    title: "Millionaire",
    progress: () => DATA.resources.greenPaper.amt.value,
    condition: () => 1e6,
    conditionText: "Get 1.00 M Green Papers.",
    hyperCondition: () => 1e60,
    hyperConditionText: "Get 1.00e60 Green Papers."
  }),
  new Achievement({
    id: 9,
    title: "Billionaire",
    progress: () => DATA.resources.greenPaper.amt.value,
    condition: () => 1e9,
    conditionText: "Get 1.00 B Green Papers.",
    hyperCondition: () => 1e90,
    hyperConditionText: "Get 1.00e90 Green Papers."
  }),
  new Achievement({
    id: 10,
    title: "Into the Deep",
    progress: () => D(0),
    condition: () => 1,
    conditionText: "Collapse.",
    hyperCondition: () => 5,
    hyperConditionText: "Collapse 5 times."
  }),
  new Achievement({
    id: 11,
    title: "Miner Production!",
    condition: () => false,
    conditionText: "Get your first Recruiter / Miner Miner."
  }),
  new Achievement({
    id: 12,
    title: "???",
    condition: () => false,
    conditionText: "???"
  }),
  new Achievement({
    id: 13,
    title: "Real Treasures",
    condition: () => false,
    conditionText: "Get your first Artifact."
  }),
  new Achievement({
    id: 14,
    title: "???",
    condition: () => false,
    conditionText: "???"
  }),
  new Achievement({
    id: 15,
    title: "???",
    condition: () => false,
    conditionText: "???"
  }),
  new Achievement({
    id: 16,
    title: "Consumed.",
    progress: () => D(player.quarry.depth),
    condition: () => 200,
    conditionText: "Reach the Dark Dimension.",
    hyperCondition: () => 300,
    hyperConditionText: "Reach Quarry Depth 300."
  }),
  new Achievement({
    id: 17,
    title: "Dark Mana",
    condition: () => false,
    conditionText: "Get ??? Dark Energy."
  }),
  new Achievement({
    id: 18,
    title: "Tone Up To 11!",
    condition: () => false,
    conditionText: "Get 11 Dark Tonings."
  }),
  new Achievement({
    id: 19,
    title: "???",
    condition: () => false,
    conditionText: "???"
  })
];

export function achInterval() {
  for (const ach of ACH_LIST) ach.give();
}

TABS.Achievements = {
  component: {
    template: `<div>
      Achievements: {{ACH_GOT}} / {{ACH_COUNT}} ({{(ACH_GOT / ACH_COUNT * 100).toFixed(2)}}%)<br/>
      Hyperfied: {{HYPER_GOT}} / {{HYPER_COUNT}} ({{(HYPER_GOT / HYPER_COUNT * 100).toFixed(2)}}%)
      <br/><br/>
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
        ACH_GOT: player.ach.length,
        HYPER_COUNT: ACH_LIST.filter((x) => x.hyperCondition).length,
        HYPER_GOT: player.hyperAch.length
      };
    }
  }
};

// DOM
setupVue.ach = {
  props: [`achId`],
  computed: {
    completed() {
      return this.ach.has();
    },
    hyperfied() {
      return this.ach.hyperHas();
    },
    progress() {
      return D(this.ach.progress?.());
    },
    condition() {
      return D(
        this.ach.progress ? this.ach._condition() : this.ach.condition()
      );
    },
    hyperCondition() {
      return D(
        this.ach.progress
          ? this.ach._hyperCondition?.()
          : this.ach.hyperCondition?.()
      );
    },
    percent() {
      return (
        Number(
          this.completed ? this.ach.hyperCondition?.() : this.ach.condition()
        ) || 0
      );
    }
  },
  template: `<div v-if="ach"
    :class="{
      ach: true,
      tooltip: true,
      incomplete: !completed, 
      completed: completed && !hyperfied,
      hyper: hyperfied
    }"
    :style="{
      '--progress': percent * 100 + '%'
    }"
  >
    {{ach.title}}
    <span class="tooltiptext">
      <h1>
        Condition
      </h1>
      {{ach.conditionText}}
      <i v-if="completed"><br>(Completed)</i>
      <i v-else-if="ach.progress"><br>({{format(progress, 0)}} / {{format(condition, 0)}})</i>
      <i v-else-if="condition > 0"><br>({{format(condition * 100)}}%)</i>
      <template v-if="completed && ach.hyperCondition">
        <h1>
          Hyper Condition
        </h1>
        {{ach.hyperConditionText}}
        <i v-if="hyperfied"><br>(Completed)</i>
        <i v-else-if="ach.progress"><br>({{format(progress, 0)}} / {{format(hyperCondition, 0)}})</i>
        <i v-else-if="hyperCondition > 0"><br>({{format(hyperCondition * 100)}}%)</i>
      </template>
    </span>
  </div>`,
  setup(props) {
    return {
      ach: ACH_LIST[props.achId],
      format
    };
  }
};
