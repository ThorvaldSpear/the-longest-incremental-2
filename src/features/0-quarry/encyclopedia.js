import { setupVue } from "../../setup.js";
import { TABS } from "../../components/tabs.js";
import { LAYER_DATA, ORE_DATA } from "./quarry.js";

TABS["ore-stats"] = {
  disp: "Ore Stats",
  component: {
    template: `<div>
    <h2>Ore Stats</h2>
    <div>
      Pretty self expanatory. Rarity divides block health but multiplies ore value.
    </div>
    <ore-entry
      v-for="(_, i) in ORE_DATA"
      type="ore"
      :name="i"
    />
  </div>`,
    setup() {
      return {
        ORE_DATA
      };
    }
  }
};

TABS["block-stats"] = {
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
      <ore-entry
        v-for="(_, i) in LAYER_DATA"
        type="layer"
        :name="i"
      />
    </div>`,
    setup() {
      return {
        LAYER_DATA
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
