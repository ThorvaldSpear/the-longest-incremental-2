import { setupVue } from "../../setup.js";
import { TABS } from "../../components/tabs.js";
import { D } from "../../utils/break_eternity.js";

import { player } from "../../player.js";
import { LAYER_DATA, ORE_DATA } from "./quarry.js";

TABS.Encyclopedia = {
  subtabs: ["OreStats", "BlockStats", "Story"],
  component: {
    template: ``
  }
};

TABS.OreStats = {
  disp: "Ore Stats",
  component: {
    template: `<div>
      <h2>Ore Stats</h2>
      <div>
        Pretty self expanatory. Rarity divides block health but multiplies ore value.
      </div>
      <div v-for="(name, block) of Object.entries(ORE_DATA)">
        <ore-entry
          type="ore"
          :name="block"
        />
      </div>
    </div>`,
    setup() {
      return {
        ORE_DATA,
        D,
        player
      };
    }
  }
};

TABS.BlockStats = {
  disp: "Block Stats",
  component: {
    template: `<div>
      <h2>Block Stats</h2>
      <div>
        Block spawn calculations work a bit differently.<br>
        They are weighted and their weight increases up to "chance max" and then decreases
        until it no longer spawns.
        This scales linearly.
      </div>
      <div v-for="(name, block) of Object.entries(LAYER_DATA)">
        <ore-entry
          type=""
          :name="block"
        />
      </div>
    </div>`,
    setup() {
      return {
        LAYER_DATA,
        D,
        player
      };
    }
  }
};

setupVue["ore-entry"] = {
  props: ["type", "name"],
  template: `
    <h2 :style="{'background-color': ore.color}">{{name}}</h2>
    <div>Health multiplier: {{isOre ? ore.density : ore.health}}x</div>
    <div>Starts spawning at Depth {{isOre ? ore.range[0] : ore.range.spawn}}</div>
    <div v-if="!isOre">
      Spawn chance maxed at Depth {{ore.range.full}}<br>
      Spawn chance decreasing starting at {{ore.range.decrease}}
    </div>
    <div>Stops spawning at Depth {{isOre ? ore.range[1] : ore.range.despawn}}</div>
    <div v-if="isOre">
      Rarity: {{ore.rarity}}
    </div>
  `,
  computed: {
    ore() {
      return (this.isOre ? ORE_DATA : LAYER_DATA)[this.name];
    },
    isOre() {
      return this.type === "ore";
    }
  }
};

TABS.Story = {
  component: {
    template: `
      <h2>Welcome!</h2>
      Where am I? Was I dreaming about my dream work?<br>
      Let's just look around the map.

      <br><br>
      Hmmm... A worker? Hey, can I talk for a moment?<br>
      "Where am I?," he said. "This is a quarry site we need, we mine for King's needs," the worker said.<br>
      He realized he was transported into another castle. He need Mana in order to free himself with helpers.<br>
      And so, the journey begins.

      <br><br>
      Welcome to the Longest Incremental^2. Here, you can hire Miners with Mana.<br>
      Later on, you can sell ores for Green Papers which can be spent for Upgrades!<br>
      Have fun!
    `
  }
};
