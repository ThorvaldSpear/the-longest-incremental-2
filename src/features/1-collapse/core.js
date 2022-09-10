import { D } from "../../utils/break_eternity.js";
import { player } from "../../player.js";
import { Layer, doLayerReset } from "../../components/layer.js";
import { TABS } from "../../components/tabs.js";
import { initQuarry } from "../0-quarry/quarry.js";
import { DATA } from "../../tmp.js";

const COLLAPSE_REQ = D(100);
//to-do: resets everything prior to Collapse
//to-do: implement Corporates, Artifacts, and Consumption

//layer 1
const COLLAPSE = new Layer({
  name: "Collapse",
  playerIndex: "collapse",

  currency: "Collapses",
  gainFormula: () => D(1),

  canPrestige() {
    return D(player.quarry.depth).gte(COLLAPSE_REQ);
  },
  resetFunc() {
    player.gp = { upg: {} };
    player.inventory.map = [];
    player.miners = {
      amt: {},
      used: {},
      manualCooldown: 0
    };
    player.quarry = initQuarry();
  },

  statsRecord: {
    tick() {
      return;
    },
    reset() {
      return {
        depth: player.quarry.depth,
        gp: DATA.resources.greenPaper.amt.value
      };
    }
  },
  miscData() {
    return {};
  }
});

export function collapse() {
  doLayerReset(1);
}

//TABS
TABS.Guild = {
  subtabs: ["Hiring", "Equipment", "Consumption", "CollapseMilestones"],
  component: {
    template: `You have collapsed 0 Times.`,
    setup() {
      return {
        collapse: DATA.resources.collapse
      };
    }
  }
};

TABS.Hiring = {
  component: {
    template: `Soon.`
  }
};

TABS.CollapseMilestones = {
  disp: "Collapse Milestones",
  component: {
    template: `Soon.`
  }
};

TABS.StatsLayer1 = {
  disp: "Collapse",
  component: {
    template: `Soon.`
  }
};

TABS.StatsHistory1 = {
  disp: "Collapse",
  component: {
    template: `
      Here are the last 10 Collapses you have performed:
      <table>
        <tr>
          <td><b>Collapse</b></td>
          <td><u>Quarry Depth</u></td>
          <td><u>Total Miners</u></td>
          <td><u>Green Papers</u></td>
        </tr>
        <tr v-for="i in 10">
          <td>#{{i}}</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
        </tr>
      </table>
    `
  }
};
