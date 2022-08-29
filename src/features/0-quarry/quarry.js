import Decimal, { D } from "../../utils/break_eternity.js";
import { format } from "../../utils/format.js";
import { generateGradient } from "../../utils/gradient.js";

import { DATA } from "../../tmp.js";
import { player } from "../../player.js";
import { setupVue } from "../../setup.js";

import { TABS } from "../../components/tabs.js";
import { Resource, RESOURCES } from "../../components/resources.js";
import { BUYABLES, hasUpgrade } from "../../components/buyables.js";

const LAYER_DATA = {
  Dirt: {
    color: "#7f5f3f",
    range: [0, 0, 4, 6],
    rarity: 1,
    worth: 0.03,
    health: 1
  },
  Stone: {
    color: "grey",
    range: [3, 6, 45, 50],
    rarity: 1,
    worth: 0.05,
    health: 3
  },
  Granite: {
    color: "#bf7f7f",
    range: [35, 50, 90, 100],
    rarity: 1,
    worth: 0.05,
    health: 5
  },
  Basalt: {
    color: "#3f4f5f",
    range: [80, 100, Infinity, Infinity],
    rarity: 1,
    worth: 0.05,
    health: 10
  },
  Bedrock: {
    color: "black",
    range: [Infinity, Infinity, Infinity, Infinity],
    rarity: 0,
    worth: 0,
    health: Infinity
  }
};

const ORE_DATA = {
  Bronze: {
    color: "#CD7F32",
    range: [2, 75],
    rarity: 5,
    worth: 0.25,
    health: 10
  },
  Silver: {
    color: "#f2f0f0",
    range: [4, 100],
    rarity: 10,
    worth: 0.5,
    health: 15
  },
  Gold: {
    color: "#ffe600",
    range: [10, 150],
    rarity: 15,
    worth: 1,
    health: 20
  },
  Platinum: {
    color: "#e9ffd4",
    range: [75, 200],
    rarity: 100,
    worth: 5,
    health: 30
  },
  Diamond: {
    color: "#91fffa",
    range: [100, 200],
    rarity: 30,
    worth: 2,
    health: 50
  },
  Adamantite: {
    color: "#c93030",
    range: [125, 175],
    rarity: 20,
    worth: 3,
    health: 75
  },
  Mythril: {
    color: "#23db8b",
    range: [175, 200],
    rarity: 200,
    worth: 10,
    health: 200
  },
  Orichalcum: {
    color: "#ff52c8",
    range: [1e3, 5e3],
    rarity: 225,
    health: 1e4
  },
  Titanium: {
    color: "#b6abff",
    range: [1e4, 3e4],
    rarity: 600,
    health: 1e5
  },
  Uranium: {
    range: [6e4, 3e5],
    rarity: 1150,
    health: 1e7
  },
  Biluth: {
    range: [1e5, 8e5],
    rarity: 2500,
    health: 1e9
  },
  Cystalium: {
    range: [1e6, 5e6],
    rarity: 4700,
    health: 1e12
  },
  Chromium: {
    range: [1e8, 5e8],
    rarity: 10000,
    health: 1e15
  },
  "Black Diamond": {
    range: [1e10, 1e11],
    rarity: 50e3,
    health: 1e20
  },
  Brimstone: {
    range: [1e13, 1e15],
    rarity: 1e4,
    health: 1e27
  }
  /*Hakalium: {
    range: [1e18, 5e20],
    rarity: 4e6,
    health: 1e31
  },
  Spulatize: {
    range: [1e22, 5e24],
    rarity: 7e7,
    health: 1e35
  },
  Cachatizium: {
    range: [1e26, 5e28],
    rarity: 1e9,
    health: 1e40
  },
  // you have big creativity...
  Nuzosistum: {
    range: [1e30, 1e33],
    rarity: 1e11,
    health: 1e45
  },
  Spaserzantium: {
    range: [1e35, 7e40],
    rarity: 1e14,
    health: 1e55
  },
  Blismuner: {
    range: [1e45, 1e50],
    rarity: 1e18,
    health: 1e65
  },
  Shungerium: {
    range: [1e55, 1e60],
    rarity: 1e21,
    health: 1e80
  }, // man im running out of names lmao
  MG11: {
    range: [1e65, 1e70],
    rarity: 1e24,
    health: 1e90
  },
  MG12: {
    range: [1e75, 1e80],
    rarity: 1e27,
    health: 1e100
  },
   "ALE-11": {
    range: [1e85, 1e90],
    rarity: 1e31,
    health: 1e110
  },
   "SE-IV": {
    range: [1e100, 1e110],
    rarity: 1e35,
    health: 1e125
  },
  "SE-V": {
    range: [1e125, 1e140],
    rarity: 1e40,
    health: 1e150
  },
  "AV-91-B": { // i think im gonna create randomizer in C# rq
    range: [1e160, 1e180],
    rarity: 1e45,
    health: 1e175
  },
  "AV-91-C": { 
    range: [1e200, 1e220],
    rarity: 1e55,
    health: 1e200
  },
  "Strazfauser": { 
    range: [1e250, 1e300],
    rarity: 1e70,
    health: 1e260
  },
  "AV-308": { // After this player can earn Purple Tokens... They work like Green Papers but are intented for upgrades and more features
    range: [1e308, Number.MAX_VALUE],
    rarity: 1e95,
    health: Number.MAX_VALUE
  },
  "Break Infinity": {
    range: [D("1e309"), D("1e310")],
    rarity: 1e120,
    health: D("1e400")
  }*/
};
const BLOCK_DATA = {
  ...LAYER_DATA,
  ...ORE_DATA
};

for (const [index, key] of Object.entries(BLOCK_DATA)) {
  let fix = index.toLowerCase();
  RESOURCES[fix] = new Resource({
    name: index,
    color: key.color,
    src: {
      parent: () => player.quarry.ores,
      id: index
    }
  });
}

function getBlockStrength(depth) {
  let ret = D(1e3).pow(Decimal.div(depth, 50));
  ret = ret.div(10).add(0.9);
  return ret;
}

function getBlockHealth(depth, layer, ore) {
  return getBlockStrength(depth)
    .mul(LAYER_DATA[layer].health)
    .mul(ORE_DATA[ore]?.health ?? 1);
}

function getBlockAmount(index) {
  return DATA.resources[index.toLowerCase()].amt.value;
}

function sellBlock(index) {
  RESOURCES.greenPaper.add(getBlockAmount(index).mul(BLOCK_DATA[index].worth));
  RESOURCES[index.toLowerCase()].set(0);
}

function getTotalBlocks(x) {
  let ret = D(0);
  for (const value of Object.values(player.miners.ores)) ret = ret.add(value);
  return ret;
}

function getRangeMulti(value, range) {
  value = D(value);
  if (value.gte(range[1]) && value.lte(range[2])) return 1;
  if (value.lte(range[0]) || value.gte(range[3])) return 0;
  if (value.lt(range[1]))
    return Number(value.sub(range[0]).div(D(range[1]).sub(range[0])));
  return 1 - Number(value.sub(range[2]).div(D(range[3]).sub(range[2])));
}

function generateBlock(depth) {
  depth = D(depth).round();

  let layer = "";
  let sum = 0;
  for (const [_, key] of Object.entries(LAYER_DATA)) {
    sum += +getRangeMulti(depth, key.range);
  }

  let random = Math.random();
  let sum2 = 0;
  for (const [index, key] of Object.entries(LAYER_DATA)) {
    sum2 += getRangeMulti(depth, key.range) / sum;
    if (sum2 >= random) {
      layer = index;
      break;
    }
  }

  let ore = "";
  random = Math.random();
  for (const [index, key] of Object.entries(ORE_DATA)) {
    if (depth.lt(key.range[0]) || depth.gt(key.range[1])) continue;
    if (1 / random >= key.rarity) ore = index;
  }
  if (depth.gt(100)) {
    layer = "Bedrock";
    ore = "";
  }

  let treasure = false;
  if (ore.rarity > 10 && Math.random() < 0.3) treasure = true;

  const health = getBlockHealth(depth, layer, ore);
  return {
    layer,
    ore,
    health,
    treasure
    // not needed, can be computed
  };
}

function getRarity(x) {
  if (x > 10 ** 4.5) return "Almighty";
  if (x > 10 ** 4) return "Divine";
  if (x > 10 ** 3.5) return "Mythical";
  if (x > 10 ** 3) return "Legendary";
  if (x > 10 ** 2.5) return "Epic";
  if (x > 10 ** 2) return "Unique";
  if (x > 10 ** 1.5) return "Rare";
  if (x > 10 ** 1) return "Uncommon";
  if (x > 10 ** 0.5) return "Common";
  return "Supplementary";
}

/*
note to self on how quarry works:
Array<Array<{id, health}, WIDTH>, HEIGHT> items for managing the quarry
each item contains data about quarry
depth starts at 0

*/
export const QUARRY_SIZE = {
  width: 10,
  height: 10
};
function generateQuarryRow(depth) {
  let array = Array(QUARRY_SIZE.width)
    .fill()
    .map(() => generateBlock(depth));
  return array;
}
function generateQuarryMap(depthStart = 0) {
  let array = Array(QUARRY_SIZE.height)
    .fill()
    .map((_, i) => generateQuarryRow(depthStart + i));
  return array;
}
export function initQuarry() {
  return {
    ores: {},
    depth: D(0),
    map: generateQuarryMap()
  };
}
function incrementQuarryRow() {
  player.quarry.depth = Decimal.add(player.quarry.depth, 1);

  player.quarry.map.splice(0, 1);
  player.quarry.map.push(
    generateQuarryRow(player.quarry.depth.add(QUARRY_SIZE.height - 1))
  );
}

export function doQuarryTick(diff) {
  for (const miner of BUYABLES.Miners.data) {
    miner.hit(diff);
  }

  let empty = true;
  for (const i of player.quarry.map[0]) {
    // health is not gaurenteed to be Decimal
    if (Decimal.gt(i.health, 0)) {
      empty = false;
      break;
    }
  }
  if (empty) incrementQuarryRow();
}

//TODO: Implement the biomes and the map.
//DOM STUFF
TABS.QuarrySite = {
  disp: "The Site",
  parent: "Quarry",
  component: {
    template:
      `
      <div style="display: flex; flex-direction: row; vertical-align: top">
        <div style="flex: 1 0 450px">
          <buyables group="Miners" />
        </div>
        <div style="flex: 1 0 320px">
          You are currently in Depth {{format(player.quarry.depth, 0)}} / 100.<br>
          <grid type="QuarryBlock" 
                :width="QUARRY_SIZE.width" 
                :height="QUARRY_SIZE.height" 
                style="border: 2px solid green" />` +
      /*<button>Exit Map</button>*/
      `</div>
        <div style="flex: 1 0 450px">
          <resource name="greenPaper" />
          <table>
            <tr 
              v-for="[index, key] of Object.entries(BLOCK_DATA).filter((x) => getBlockAmount(x[0]).gt(0))"
              :key="index">
              <td><resource :name="index.toLowerCase()"/></td>
              <td><button @click="sellBlock(index)">
                Sell!<br>
                (+ {{format(getBlockAmount(index).mul(key.worth))}} Green Papers)
              </button></td>
              <td><button v-if="hasUpgrade('GreenPapers', 5)" @click="buyBlock(index)">
                Buy!<br>
                (Cost: {{format(key.worth.mul(1.5))}} Green Papers)
              </button></td>
            </tr>
          </table>
        </div>
      </div>
    `,
    setup() {
      const resources = DATA.resources;
      return {
        BLOCK_DATA,
        QUARRY_SIZE,
        player,
        format,
        resources,
        hasUpgrade,

        getBlockAmount,
        sellBlock
      };
    }
  }
};

setupVue.QuarryBlock = {
  props: ["width", "height", "x", "y"],
  computed: {
    block() {
      return player.quarry.map[this.y][this.x];
    },
    health() {
      return getBlockHealth(
        Decimal.add(player.quarry.depth, this.y),
        this.block.layer,
        this.block.ore
      );
    },
    style() {
      const layerColor = LAYER_DATA[this.block.layer].color ?? "white";
      const oreColor = ORE_DATA[this.block.ore]?.color ?? "transparent";
      return {
        background: `radial-gradient(
          ${oreColor}, ${this.block.treasure ? "#ffefbf" : oreColor}
        ), linear-gradient(${layerColor}, ${layerColor})`,
        opacity: D(this.block.health).div(this.health).pow(0.5).toNumber()

        /*
        `radial-gradient(
          circle closest-side at center,
          ${BLOCK_DATA[this.block.id].color ?? "white"},
          rgb(${this.generateGradient(
            [255, 20, 0],
            [20, 255, 0],
            Number.parseInt(this.height, 10) // this makes it smoother lmaooooo
            // doing that will break things
          )[y].join(", ")}))` // cool
        */
      };
    }
  },
  template: `
    <div class="tooltip">
      <div :style="style" style="width: 32px; height: 32px"></div>
      <span v-if="Decimal.gt(block.health, 0) && block.name !== 'Bedrock'" class="tooltiptext">
        <b style='font-size: 16px'>Block Type: {{block.layer}}</b><br>
        <span v-if="block.ore !== ''">
          Ore: {{block.ore}} ({{getRarity(ORE_DATA[block.ore].rarity)}})
        </span><br>
        Health: {{format(block.health)}}/{{format(health)}}<br>
        <b v-if="block.treasure" style='color: gold'>Treasure inside!</b>
      </span>
    </div>
  `,
  setup() {
    return {
      generateGradient,
      format,
      getRarity,
      LAYER_DATA,
      ORE_DATA,
      Decimal
    };
  }
};
