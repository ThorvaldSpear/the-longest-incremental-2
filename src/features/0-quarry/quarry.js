import { player } from "../../player.js";
import { DATA, TICK_DATA } from "../../tmp.js";

import Decimal, { D } from "../../utils/break_eternity.js";
import { format, formatPrecise, formatTime } from "../../utils/format.js";
import { notify } from "../../utils/notify.js";

import {
  BUYABLES,
  getUpgradeEff,
  hasUpgrade
} from "../../components/buyables.js";
import {
  createChainedMulti,
  createMultiplicativeMulti,
  createUpgradeMulti
} from "../../components/gainMulti.js";
import { TABS } from "../../components/tabs.js";
import { Resource, RESOURCES } from "../../components/resources.js";

import { generateBlock, getBlockAmount } from "./blocks.js";

import { getMinerEff } from "./miners.js";

/* -=- QUARRY -=- */
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
export function getQuarryDepth() {
  return D(inQuarryMap() ? player.quarry.inMap.depth : player.quarry.depth);
}
export function getEffectiveDepth(depth) {
  if (D(depth).gt(getVoidDepth()))
    depth = D(depth)
      .sub(getVoidDepth())
      .mul(getVoidStrength())
      .add(getVoidDepth());
  return depth;
}
function generateQuarryRow(depth) {
  let array = Array(QUARRY_SIZE.width)
    .fill()
    .map(() => generateBlock(depth));
  return array;
}
function generateQuarryMap(init) {
  const array = Array(QUARRY_SIZE.height)
    .fill()
    .map((_, i) =>
      generateQuarryRow(init ? i : getQuarryDepth().add(inQuarryMap() ? 0 : i))
    );
  return array;
}
export function initQuarry() {
  return {
    ores: {},
    depth: D(0),
    map: generateQuarryMap(true)
  };
}

export function isBlockExposed(x, y) {
  const map = player.quarry.map;
  return (
    Decimal.lte(map[y - 1]?.[x]?.health ?? Decimal.dZero, 0) ||
    Decimal.lte(map[y + 1]?.[x]?.health ?? Decimal.dInf, 0) ||
    Decimal.lte(map[y]?.[x - 1]?.health ?? Decimal.dInf, 0) ||
    Decimal.lte(map[y]?.[x + 1]?.health ?? Decimal.dInf, 0)
  );
}

function deleteEmptyQuarryRows() {
  const inMap = inQuarryMap();
  while (player.quarry.map[0] !== undefined) {
    for (const i of player.quarry.map[0]) {
      if (Decimal.gt(i.health, 0)) return;
    }
    player.quarry.map.splice(0, 1);

    if (!inMap) {
      player.quarry.depth = Decimal.add(player.quarry.depth, 1);
      if (D(player.quarry.depth).round().eq(getVoidDepth()))
        notify(
          "You have reached the void. At this point, no more ores will spawn and blocks scale faster. Collapse to proceed!"
        );
    } else {
      player.stats.mapRows = Decimal.add(player.stats.mapRows, 1);
    }
  }
}

function fillQuarryRows() {
  const inMap = inQuarryMap();
  while (player.quarry.map[QUARRY_SIZE.height - 1] === undefined) {
    player.quarry.map.push(
      generateQuarryRow(
        D(getQuarryDepth()).add(inMap ? 0 : player.quarry.map.length)
      )
    );
  }
}

/* -=- LAYERS -=- */
/*
Guide to how this complicated stuff works.
LAYER_DATA:
  color: self expanatory, is the color of that resource
  range: {
    spawn: starts to spawn
    full: max spawning rate
    decrease: where spawn rate starts to decrease
    despawn: never spawns again
  }
  health: multiplies health of block
*/
export const LAYER_DATA = {
  Grass: {
    color: "#3fbf00",
    range: {
      spawn: 0,
      full: 0,
      decrease: 1,
      despawn: 2
    },
    health: 1
  },
  Dirt: {
    color: "#7f5f3f",
    range: {
      spawn: 1,
      full: 1,
      decrease: 4,
      despawn: 6
    },
    health: 1
  },
  Stone: {
    color: "grey",
    range: {
      spawn: 3,
      full: 6,
      decrease: 45,
      despawn: 50
    },
    health: 2
  },
  Granite: {
    color: "#bf7f7f",
    range: {
      spawn: 35,
      full: 50,
      decrease: 60,
      despawn: 70
    },
    health: 4
  },
  Basalt: {
    color: "#3f4f5f",
    range: {
      spawn: 50,
      full: 70,
      decrease: 140,
      despawn: 150
    },
    health: 8
  },
  Obsidian: {
    color: "#0f0f3f",
    range: {
      spawn: 130,
      full: 150,
      decrease: 190,
      despawn: 190
    },
    health: 16
  },
  Bedrock: {
    color: "#5f00bf",
    range: {
      spawn: 190,
      full: 190,
      decrease: 200,
      despawn: 200
    },
    health: 32
  },
  Magma: {
    color: "#bf5f00",
    range: {
      spawn: 190,
      full: 200,
      decrease: 200,
      despawn: 200
    },
    health: 64
  },
  Darkstone: {
    color: "#5f00bf",
    range: {
      spawn: 200,
      full: 300,
      decrease: 300,
      despawn: 300
    },
    health: 48
  }
};

export function getLayerRarity(depth, range) {
  //4 depths: [spawn, full, decrease, despawn]
  //1st: where a layer starts.
  //2nd: where a layer becomes most common.
  //3rd: where a layer starts to become less common.
  //4th: where a layer ends.

  depth = D(depth);
  // if between the two spawning ranges give normal weight
  // chance is max
  if (depth.gte(range.full) && depth.lte(range.decrease)) return 1;
  // do not give weight if it is outside the spawning ranges
  // chance is none
  if (depth.lte(range.spawn) || depth.gte(range.despawn)) return 0;
  if (depth.lt(range.full))
    // if in first spawn range
    // (depth-start)/(max-start)
    return depth
      .sub(range.spawn)
      .div(D(range.full).sub(range.spawn))
      .toNumber();
  // second spawn range
  // chance decreases
  // 1- (depth-start)/(max-start)
  return (
    1 -
    depth
      .sub(range.decrease)
      .div(D(range.despawn).sub(range.decrease))
      .toNumber()
  );
}

/* -=- ORES -=- */
/*
Guide to how this complicated stuff works.
ORE_DATA:
  color: self expanatory, is the color of that resource
  range: beginning and end of spawn
  density: multiplies health
  rarity: makes the ore worth more, has less health, but also is more rarer
*/
// I don't think ore should despawn
export const ORE_DATA = {
  Bronze: {
    color: "#CD7F32",
    range: [2, 75],
    health: 1.5,
    sell: 1,
    rarity: 1
  },
  Silver: {
    color: "#f2f0f0",
    range: [4, 100],
    health: 2,
    sell: 1.5,
    rarity: 3
  },
  Gold: {
    color: "#ffe600",
    range: [10, 100],
    health: 3,
    sell: 2,
    rarity: 5
  },
  Diamond: {
    color: "#91fffa",
    range: [25, 125],
    health: 5,
    sell: 3,
    rarity: 10
  },
  Platinum: {
    color: "#e9ffd4",
    range: [50, 175],
    health: 10,
    sell: 5,
    rarity: 20
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
    },
    multipliers: {
      ore: createChainedMulti(
        () => 1,
        createMultiplicativeMulti(
          createUpgradeMulti({
            group: "GreenPapers",
            id: 2,
            type: "multiply"
          })
        ),
        createMultiplicativeMulti(
          createUpgradeMulti({
            group: "GreenPapers",
            id: 6,
            type: "multiply"
          })
        ),
        createMultiplicativeMulti(
          createUpgradeMulti({
            group: "GreenPapers",
            id: 9,
            type: "multiply"
          })
        ),
        createMultiplicativeMulti({
          toMultiply: () => getOreSparseness(index).recip(),
          enabled: () => true,
          name: "Sparseness Multiplier"
        })
      ),
      gp: createChainedMulti(
        () => Decimal.div(ORE_DATA[index].sell ?? 1, 5),
        createMultiplicativeMulti(
          createUpgradeMulti({
            group: "GreenPapers",
            id: 8,
            type: "multiply"
          })
        ),
        createMultiplicativeMulti({
          toMultiply: () => getOreSparseness(index),
          enabled: () => true,
          name: "Sparseness Multiplier"
        })
      )
    }
  });
}

function getOreSparseness(ore) {
  return Decimal.div(getQuarryDepth(), 100)
    .add(1)
    .mul(Decimal.add(Object.keys(ORE_DATA).indexOf(ore), 1));
}

export function getOreWorthMul(ore) {
  let mul = Decimal.dOne;
  if (hasUpgrade("GreenPapers", 8))
    mul = mul.mul(getUpgradeEff("GreenPapers", 8));
  return mul;
}

function getOreWorth(ore) {
  return RESOURCES[ore.toLowerCase()].multipliers.gp.value();
}

export function getOreGain(ore) {
  return RESOURCES[ore.toLowerCase()].multipliers.ore.value();
}
function getOreCost(ore) {
  return getOreWorth(ore).mul(1.5);
}

function getAllWorth() {
  let value = new Decimal(0);
  for (const name of Object.keys(ORE_DATA)) {
    value = value.add(getBlockAmount(name).mul(getOreWorth(name)));
  }
  return value;
}

function sellAllOres() {
  for (const index of Object.keys(ORE_DATA)) sellOre(index);
}

function sellOre(ore) {
  RESOURCES.greenPaper.add(getBlockAmount(ore).mul(getOreWorth(ore)));
  RESOURCES[ore.toLowerCase()].set(0);
}

function buyOreAmount(ore) {
  const halfGP = DATA.resources.greenPaper.amt.value.div(2);
  const worth = getOreCost(ore);
  return halfGP.div(worth).floor();
}

function buyOre(ore) {
  const halfGP = DATA.resources.greenPaper.amt.value.div(2);
  const worth = getOreCost(ore);
  const toBuy = halfGP.div(worth).floor();

  if (toBuy.gt(0)) {
    RESOURCES.greenPaper.sub(worth.mul(toBuy));
    RESOURCES[ore.toLowerCase()].add(toBuy);
  }
}

/* -=- VOID -=- */
export function getVoidDepth() {
  return D(100);
}

function getVoidStrength() {
  return 1.5;
}

/* -=- MAPS -=- */
export function inQuarryMap() {
  return DATA.setup ? player.quarry.inMap !== undefined : false;
}
export const switchMap = (window.switchMap = function (data) {
  player.quarry.inMap = data;
  if (!data) delete player.quarry.inMap;

  player.quarry.map = generateQuarryMap();
});

/* -=- INSERT NEW CONTENT -=- */
TICK_DATA.quarry = function (diff) {
  if (player.quarry === undefined) {
    player.quarry = initQuarry();
  }
  for (const miner of BUYABLES.Miners.data) {
    miner.hit(diff);
  }

  deleteEmptyQuarryRows();
  fillQuarryRows();
};

TABS.Quarry = {
  subtabs: ["QuarrySite", "Equipment", "GreenPapers"]
};

TABS.QuarrySite = {
  disp: "The Site",
  component: {
    template: `
      <div>
        <div>
          <span v-if="player.miners.manualCooldown">
            Click cooldown: {{formatTime(player.miners.manualCooldown)}}
          </span>
          <span v-else>
            Click on any highlighted block to deal {{format(getMinerEff(0))}}
            damage (equal to Novice Miners' damage/hit).<br>
            Click cooldown is equal to 2/[Novice Miners' seconds/hit]
          </span>
          <div v-if="!player.quarry.inMap">You are currently in Depth {{format(player.quarry.depth, 0)}} / 100.</div>
          <div>
            <button v-if="player.quarry.inMap" onclick="switchMap()">Exit Map</button>
            <button 
              v-if="new Decimal(player.quarry.depth).round().gte(getVoidDepth()) 
              && hasUpgrade('GreenPapers', 10) && !player.quarry.inMap" 
              @click="notify('Soon.')"
            >(C) Collapse!</button>
          </div>
        </div>
        <div class="flex">
          <miners class="flex-base" style="flex-basis:33%" />
          <div class="flex-base" style="flex-basis:33%">
            <grid type="Block" 
              :width="QUARRY_SIZE.width" 
              :height="QUARRY_SIZE.height" 
              style="border: 2px solid #80400;" 
              /><br>
            <block-stats />
          </div>
          <div 
            class="flex-base" 
            style="flex-basis:33%"
          >
            <resource name="greenPaper" />
            <button @click="sellAllOres()">Sell all for {{format(getAllWorth())}} GP</button>
            <table class="resourceTable">
              <tr>
                <td colspan="2">
                  Note: Quarry depth multiplies ore value but nerfs ore gain.
                </td>
              </tr>
              <tr 
                v-for="[index, key] of Object.entries(ORE_DATA).filter(
                  (x) => getBlockAmount(x[0]).gt(0))"
                :key="index">
                <td style="width:100%;font-size:13.3333px;text-align:left">
                  <resource :name="index.toLowerCase()"/>
                  <gain-multi :multi="RESOURCES[index.toLowerCase()].multipliers.ore">
                    {{format(getOreGain(index))}} unit/damage dealt
                  </gain-multi> ×
                  <gain-multi :multi="RESOURCES[index.toLowerCase()].multipliers.gp">
                    {{format(getOreWorth(index))}} GP/unit
                  </gain-multi>
                </td>
                <td>
                  <button @click="sellOre(index)">
                    Sell for {{format(getBlockAmount(index).mul(getOreWorth(index)))}} GP
                  </button>
                  <button v-if="hasUpgrade('GreenPapers', 4)" @click="buyOre(index)">
                    Buy {{format(buyOreAmount(index))}} {{index}} with 50% GP
                  </button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    `,
    setup() {
      const resources = DATA.resources;
      return {
        ORE_DATA,
        QUARRY_SIZE,
        RESOURCES,
        Decimal,
        format,
        formatPrecise,
        formatTime,
        player,
        resources,
        hasUpgrade,
        notify,

        getBlockAmount,
        getOreWorth,
        getAllWorth,
        getOreCost,
        buyOreAmount,

        sellOre,
        sellAllOres,
        buyOre,
        getOreGain,
        getMinerEff,
        getVoidDepth
      };
    }
  }
};
