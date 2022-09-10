import { setupVue } from "../../setup.js";
import { TABS } from "../../components/tabs.js";
import { D } from "../../utils/break_eternity.js";

import { player } from "../../player.js";
import { LAYER_DATA, ORE_DATA } from "./quarry.js";

TABS.OreStats = {
  disp: "Ores",
  component: {
    template: `<div>
      <h2>Ore Stats</h2>
      <div v-for="[name, block] of Object.entries(ORE_DATA)">
        <ore-entry
          v-if="D(player.quarry.depth).gte(block.range[0])"
          type="ore"
          :name="name"
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
  disp: "Blocks",
  component: {
    template: `<div>
      <h2>Block Stats</h2>
      <div>
        Block spawn calculations work a bit differently.<br>
        They are weighted and their weight increases up to "chance max" and then decreases
        until it no longer spawns.
        This scales linearly.
      </div>
      <div v-for="[name, block] of Object.entries(LAYER_DATA)">
        <ore-entry
          v-if="D(player.quarry.depth).gte(block.range.spawn)"
          type=""
          :name="name"
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
    <div>Health multiplier: {{ore.health}}x</div>
    <div>Starts spawning at Depth {{isOre ? ore.range[0] : ore.range.spawn}}</div>
    <div v-if="!isOre">
      Spawn chance maxed at Depth {{ore.range.full}}<br>
      Spawn chance decreasing starting at {{ore.range.decrease}}
    </div>
    <div>Stops spawning at Depth {{isOre ? ore.range[1] : ore.range.despawn}}</div>
    <div v-if="isOre">
      Rarity: {{ore.rarity}}<br>
      Sell price multiplier: {{ore.sell}}x
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
    <div>
      <h2>Welcome!</h2>
      <i>In a medieval colony...</i>

      <br><br>
      Where am I? How'd I get here? What am I doing here?<br>
      Oh look, there's a village nearby.<br>
      I'm just going to look around that settlement.

      <br><br>
      Hmmm... A worker? Maybe I can talk for a moment...<br>
      I question about this settlement. The worker says, "This is a quarry site, we mine for the motherland."<br>
      I remember about how hard this was years ago. It was unbearable.<br>
      But I come to a realization.

      <br><br>
      He was neither a brave worker, nor a slave.<br>
      He needs mana in order to free himself with helpers.<br>
      A-ha! Mana is what I need to live on, he said.<br>
      And so, the journey begins.

      <br><br>
      Welcome to the Longest Incremental<sup>2</sup>. Here, you can hire Miners with Mana.<br>
      Later on, you can sell ores for Green Papers which can be spent for Upgrades!<br>
      Have fun <s>and don't forget about the void</s>!
    </div>
    <div v-if="false">
      <h2>Guilding</h2>
      Soon.
    </div>
    `
  }
};
