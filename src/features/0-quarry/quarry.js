import Decimal, { D } from "../../utils/break_eternity.js";
import { format, formatPrecise } from "../../utils/format.js";
import { generateGradient } from "../../utils/gradient.js";

import { DATA } from "../../tmp.js";
import { player } from "../../player.js";
import { setupVue } from "../../setup.js";

import { TABS } from "../../components/tabs.js";
import { Resource, RESOURCES } from "../../components/resources.js";
import {
  BUYABLES,
  getUpgradeEff,
  hasUpgrade
} from "../../components/buyables.js";

export const LAYER_DATA = {
  Dirt: {
    color: "#7f5f3f",
    range: [0, 0, 4, 6],
    health: 1
  },
  Stone: {
    color: "grey",
    range: [3, 6, 45, 50],
    health: 2
  },
  Granite: {
    color: "#bf7f7f",
    range: [35, 50, 60, 70],
    health: 4
  },
  Basalt: {
    color: "#3f4f5f",
    range: [50, 70, 140, 150],
    health: 8
  },
  Obsidian: {
    color: "#0f0f3f",
    range: [130, 150, 190, 200],
    health: 16
  },
  Magma: {
    color: "#bf5f00",
    range: [190, 200, 210, 210],
    health: 64
  },
  Darkstone: {
    color: "#5f00bf",
    range: [200, 300, 300, 300],
    health: 32
  },
  Bedrock: {
    color: "black",
    range: [Infinity, Infinity, Infinity, Infinity],
    health: Infinity
  }
};

export const ORE_DATA = {
  Bronze: {
    color: "#CD7F32",
    range: [2, 125],
    density: 1.5,
    rarity: 1
  },
  Silver: {
    color: "#f2f0f0",
    range: [4, 150],
    density: 4,
    rarity: 2
  },
  Gold: {
    color: "#ffe600",
    range: [10, 100],
    density: 6,
    rarity: 3
  },
  Diamond: {
    color: "#91fffa",
    range: [25, 190],
    density: 8,
    rarity: 2.5
  },
  Platinum: {
    color: "#e9ffd4",
    range: [50, 175],
    density: 10,
    rarity: 5
  }
  /*Adamantite: {
    color: "#c93030",
    range: [125, 175],
    rarity: 100,
    sparseness: 2500,
    worth: 20,
    health: 5
  },
  Mythril: {
    color: "#23db8b",
    range: [175, 200],
    rarity: 50,
    sparseness: 10000,
    worth: 10,
    health: 10
  },
  Orichalcum: {
    color: "#ff52c8",
    range: [100, 200],
    rarity: 200,
    sparseness: 50000,
    health: 10
  },
  Titanium: {
    color: "#b6abff",
    range: [75, 300],
    rarity: 600,
    sparseness: 300000,
    health: 10
  },
  Uranium: {
    range: [150, 190],
    rarity: 10,
    sparseness: 1e6,
    health: 5
  },
  Biluth: {
    range: [125, 150],
    rarity: 1000,
    sparseness: 1e6,
    health: 20
  },
  Chromium: {
    range: [150, 175],
    rarity: 1000,
    sparseness: 1e4,
    health: 500
  },
  Cystalium: {
    range: [175, 200],
    rarity: 1000,
    sparseness: 5000,
    health: 300
  },
  "Black Diamond": {
    range: [190, 200],
    rarity: 10,
    sparseness: 2e5,
    health: 1e5
  },
  Brimstone: {
    range: [190, 250],
    rarity: 50,
    sparseness: 5e6,
    health: 1e6
  }
  Hakalium: {
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

for (const [index, key] of Object.entries(ORE_DATA)) {
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

function getBlockAmount(index) {
  return DATA.resources[index.toLowerCase()].amt.value;
}

function getBlockHealth(depth, layer, ore) {
  let ret = getBlockStrength(depth).mul(LAYER_DATA[layer].health);
  ret = ret.mul(DATA.setup ? getUpgradeEff("GreenPapers", 6) : 1);

  if (ore !== "") {
    ret = ret.mul(ORE_DATA[ore].density);
    ret = ret.div(ORE_DATA[ore].rarity);
  }
  return ret;
}

//Layers
function getRangeMulti(value, range) {
  value = D(value);
  if (value.gte(range[1]) && value.lte(range[2])) return 1;
  if (value.lte(range[0]) || value.gte(range[3])) return 0;
  if (value.lt(range[1]))
    return Number(value.sub(range[0]).div(D(range[1]).sub(range[0])));
  return 1 - Number(value.sub(range[2]).div(D(range[3]).sub(range[2])));
}

//Ores
function getOreSparseness(ore) {
  return getBlockStrength(ORE_DATA[ore].range[0]);
}

export function getOreGain(ore) {
  let mul = getUpgradeEff("GreenPapers", 2).mul(
    getUpgradeEff("GreenPapers", 9)
  );
  mul = mul.div(getOreSparseness(ore));

  return mul;
}

function getOreWorth(ore) {
  return getOreSparseness(ore)
    .mul(ORE_DATA[ore].rarity)
    .mul(getUpgradeEff("GreenPapers", 8));
}

function getOreCost(ore) {
  return getOreWorth(ore).mul(1.5);
}

function sellOre(ore) {
  RESOURCES.greenPaper.add(getBlockAmount(ore).mul(getOreWorth(ore)));
  RESOURCES[ore.toLowerCase()].set(0);
}

function buyOre(ore) {
  const worth = getOreCost(ore);
  if (RESOURCES.greenPaper.gte(worth)) {
    RESOURCES.greenPaper.sub(worth);
    RESOURCES[ore.toLowerCase()].add(1);
  }
}

/*function getTotalBlocks(x) {
  let ret = D(0);
  for (const value of Object.values(player.miners.ores)) ret = ret.add(value);
  return ret;
}*/

function generateBlock(depth) {
  depth = D(depth).round();

  let layer = "";
  let sum = 0;
  for (const value of Object.values(LAYER_DATA)) {
    sum += getRangeMulti(depth, value.range);
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

  let rarity = 5;
  if (DATA.setup) rarity /= getUpgradeEff("GreenPapers", 5).toNumber();

  let ore = "";
  for (const [index, key] of Object.entries(ORE_DATA)) {
    if (depth.lt(key.range[0]) || depth.gt(key.range[1])) continue;
    if (1 / Math.random() >= rarity * key.rarity) ore = index;
  }
  if (depth.gte(100)) {
    layer = "Bedrock";
    ore = "";
  }

  let treasure = false;
  if (depth.gt(25) && ore === "" && layer !== "Bedrock" && Math.random() < 0.05)
    treasure = true;

  let health = getBlockHealth(depth, layer, ore);
  return {
    layer,
    ore,
    health,
    treasure
    // not needed, can be computed
  };
}

function getRarity(x) {
  if (x > 10 ** 4) return "Almighty";
  if (x > 10 ** 3.5) return "Divine";
  if (x > 10 ** 3) return "Mythical";
  if (x > 10 ** 2.5) return "Legendary";
  if (x > 10 ** 2) return "Epic";
  if (x > 10 ** 1.5) return "Unique";
  if (x > 10 ** 1) return "Rare";
  if (x > 10 ** 0.5) return "Uncommon";
  return "Common";
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
function generateQuarryMap() {
  let array = Array(QUARRY_SIZE.height)
    .fill()
    .map((_, i) => generateQuarryRow(i));
  return array;
}
export function initQuarry() {
  return {
    ores: {},
    depth: D(0),
    map: generateQuarryMap()
  };
}
export function incrementQuarryRow() {
  player.quarry.depth = Decimal.add(player.quarry.depth, 1);

  player.quarry.map.splice(0, 1);
  player.quarry.map.push(
    generateQuarryRow(player.quarry.depth.add(QUARRY_SIZE.height - 1))
  );
}

export function doQuarryTick(diff) {
  if (player.quarry === undefined) {
    player.quarry = initQuarry();
  }
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
        <div style="flex: 1 0 33.33%">
          <resource name="mana" />
          <buyables group="Miners" />
        </div>
        <div style="flex: 1 0 33.33%">
          You are currently in Depth {{format(player.quarry.depth, 0)}} / 100.<br><br>
          <grid type="QuarryBlock" 
                :width="QUARRY_SIZE.width" 
                :height="QUARRY_SIZE.height" 
                style="border: 2px solid green" />` +
      /*<button>Exit Map</button>*/
      // why does it not work???????????
      `</div>
        <div style="flex: 1 0 33.33%">
          <resource name="greenPaper" />
          <table class="resourceTable">
            <tr 
              v-for="[index, key] of Object.entries(ORE_DATA).filter((x) => getBlockAmount(x[0]).gt(0))"
              :key="index">
              <td style="width:calc(100%);text-align:left">
                <resource :name="index.toLowerCase()"/>
                <div style="font-size:13.3333px"> 
                  (+1 per {{format(getOreGain(index).recip())}} damage dealt)<br>
                  (+{{format(getOreWorth(index))}} Green Papers per 1 {{index}})
                </div>
              </td>
              <td>
                <button @click="sellOre(index)">
                  Sell for {{format(getBlockAmount(index).mul(getOreWorth(index)))}} GP
                </button>
                <button v-if="hasUpgrade('GreenPapers', 4)" @click="buyOre(index)">
                  Buy ??? for with 50% GP
                </button>
              </td>
            </tr>
          </table>
        </div>
      </div>
    `,
    setup() {
      const resources = DATA.resources;
      window.Decimal = Decimal;
      return {
        ORE_DATA,
        QUARRY_SIZE,
        Decimal,
        format,
        formatPrecise,
        player,
        resources,
        hasUpgrade,

        getBlockAmount,
        getOreWorth,
        getOreCost,
        getOreGain,

        sellOre,
        buyOre
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
      const treasureColor = this.block.treasure ? "#ffefbf" : "#0003";
      const health = D(this.block.health)
        .div(this.health)
        .pow(0.5)
        .max(0)
        .min(1)
        .toNumber();

      if (health > 0)
        return {
          // why linear gradient on the _same_ thing
          background: `
            linear-gradient(#0003, #0003),
            linear-gradient(#0003, #0003),
            linear-gradient(${oreColor}, ${oreColor}),
            linear-gradient(${layerColor}, ${layerColor}),
            linear-gradient(${treasureColor}, ${treasureColor}),
            linear-gradient(${layerColor}, ${layerColor})
          `,
          "background-position":
            "center, center, center, center, center, center",
          "background-size": `${(1 - health) * 100}% 2px, 2px ${
            (1 - health) * 100
          }%, 50% 50%, calc(100% - 2px) calc(100% - 2px), 100% 100%, 100% 100%`,
          "background-repeat":
            "no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat"
        };
      else
        return {
          background: `
            linear-gradient(#0007, #0007),
            linear-gradient(${layerColor}, ${layerColor}),
            linear-gradient(${treasureColor}, ${treasureColor}),
            linear-gradient(${layerColor}, ${layerColor})
          `,
          "background-position": "center, center, center, center",
          "background-size": `100% 100%, calc(100% - 2px) calc(100% - 2px), 100% 100%, 100% 100%`,
          "background-repeat": "no-repeat, no-repeat, no-repeat, no-repeat"
        };
    }
  },
  template: `
    <div class="tooltip">
      <div :style="style" style="width: 32px; height: 32px; transition: background-size .5s"></div>
      <span v-if="Decimal.gt(block.health, 0) && block.layer !== 'Bedrock'" class="tooltiptext">
        <b style='font-size: 16px'>Block Type: {{block.layer}}</b>
        <span v-if="block.ore !== ''">
          <br>Ore: {{block.ore}} ({{getRarity(ORE_DATA[block.ore].rarity)}})
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
