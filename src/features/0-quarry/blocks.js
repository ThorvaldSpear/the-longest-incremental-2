import { setupVue } from "../../setup.js";

import { player } from "../../player.js";
import { DATA } from "../../tmp.js";

import Decimal, { D } from "../../utils/break_eternity.js";
import { format } from "../../utils/format.js";
import { getRarity } from "../../utils/utils.js";

import { getUpgradeEff } from "../../components/buyables.js";
import {
  createChainedMulti,
  createMultiplicativeMulti,
  createUpgradeMulti
} from "../../components/gainMulti.js";
import { RESOURCES } from "../../components/resources.js";

import {
  ORE_DATA,
  LAYER_DATA,
  getQuarryDepth,
  getVoidDepth,
  getEffectiveDepth,
  isBlockExposed,
  inQuarryMap,
  getLayerRarity,
  getOreGain
} from "./quarry.js";
import { getMiner, getMinerEff } from "./miners.js";
import { getTreasure } from "./treasures.js";
import { reactive } from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";

/* -=- BLOCKS -=- */
function getBlockStrength(depth) {
  depth = getEffectiveDepth(depth);

  let ret = D(1e3).pow(Decimal.div(depth, 50)).div(10).add(0.9);
  return ret;
}

export function getBlockAmount(index) {
  return DATA.resources[index.toLowerCase()].amt.value;
}

export function generateBlock(depth) {
  depth = D(depth).round();

  let layer = "";
  let sum = 0;
  for (const value of Object.values(LAYER_DATA)) {
    sum += getLayerRarity(depth, value.range);
  }

  let random = Math.random();
  let sum2 = 0;
  for (const [index, key] of Object.entries(LAYER_DATA)) {
    sum2 += getLayerRarity(depth, key.range) / sum;
    if (sum2 >= random) {
      layer = index;
      break;
    }
  }

  let rarity = 5;
  if (DATA.setup) rarity /= getUpgradeEff("GreenPapers", 5).toNumber();
  if (inQuarryMap()) rarity /= player.quarry.inMap.freq ?? 1;

  let ore = "";
  for (const [index, key] of Object.entries(ORE_DATA)) {
    if (depth.lt(key.range[0]) || depth.gt(key.range[1])) continue;

    let rarityMult = key.rarity;
    if (inQuarryMap()) rarityMult /= player.quarry.inMap.luck ?? 1;
    if (1 / Math.random() >= rarity * Math.max(rarityMult, 1)) ore = index;
  }

  let treasure = false;
  if (depth.gt(25) && ore === "" && layer !== "Bedrock" && Math.random() < 0.05)
    treasure = true;

  let voided = false;
  if (depth.gte(getVoidDepth())) {
    voided = true;
    ore = "";
    treasure = false;
  }

  return {
    layer,
    voided,
    ore,
    health: Decimal.dOne,
    treasure
  };
}

export function mineBlock(x, y, damage) {
  const depth = getQuarryDepth().add(y);
  const maxHealth = BLOCK_STATS[y][x].value();
  const block = player.quarry.map[y][x];
  block.health = D(block.health).sub(D(damage).div(maxHealth)).min(1);

  if (block.health.lte(0)) {
    block.health = D(0);
    player.stats.mined++;
    if (block.treasure) getTreasure(depth, block.layer);
  }

  if (block.ore) {
    RESOURCES[block.ore.toLowerCase()].add(damage.mul(getOreGain(block.ore)));
  }
}

function manualMine(x, y) {
  if (player.miners.manualCooldown > 0) return;
  if (!isBlockExposed(x, y)) return;
  if (D(player.quarry.map[y][x].health).lte(0)) return;
  mineBlock(x, y, getMinerEff(0));

  player.miners.manualCooldown = D(2)
    .div(getMiner(0).speedMultiplier.value())
    .toNumber();
}

/*function getTotalBlocks(x) {
  let ret = D(0);
  for (const value of Object.values(player.miners.ores)) ret = ret.add(value);
  return ret;
}*/

const BLOCK_STATS = Array(10)
  .fill()
  .map((_, y) =>
    Array(10)
      .fill()
      .map((_, x) =>
        createChainedMulti(
          () => LAYER_DATA[player.quarry.map[y][x].layer].health,
          createMultiplicativeMulti({
            toMultiply: () => getBlockStrength(getQuarryDepth().add(y)),
            enabled: () => true,
            name: "Depth Multiplier"
          }),
          createMultiplicativeMulti(
            createUpgradeMulti({
              group: "GreenPapers",
              id: 6,
              type: "multiply",
              change: (x) => Decimal.recip(x)
            })
          ),
          createMultiplicativeMulti({
            toMultiply: () => ORE_DATA[player.quarry.map[y][x].ore].health,
            enabled: () => player.quarry.map[y][x].ore !== "",
            name: "Ore Multiplier"
          }),
          createMultiplicativeMulti({
            toMultiply: () => player.quarry.inMap.health ?? 1,
            enabled: () => player.quarry.map[y][x].ore !== "" && inQuarryMap(),
            name: "Map Multiplier"
          })
        )
      )
  );

const blockHovered = reactive([undefined, undefined]);
/* -=- INSERT NEW CONTENT -=- */

setupVue["block-stats"] = {
  computed: {
    y() {
      return blockHovered[1];
    },
    x() {
      return blockHovered[0];
    },
    block() {
      return player.quarry.map[this.y][this.x];
    },
    multi() {
      return BLOCK_STATS[this.y][this.x];
    },
    health() {
      return this.multi.value();
    }
  },
  template: `
  <div v-if="blockHovered.every(i=>i!==undefined)">
    <div>
      Location: ({{x}}, {{y}})
    </div>
    <div v-if="Decimal.lte(block.health, 0)">
      This block is already mined!
    </div>
    <div v-else-if="block.layer === 'Bedrock'">
      This block is impassable.
    </div>
    <div v-else>
      <b>Block Type: {{block.layer}}</b>
      <span v-if="block.voided">
        <br>This is a Void Block... (Collapse to proceed!)
      </span>
      <span v-if="block.ore !== ''">
        <br>Ore: {{block.ore}} ({{getRarity(ORE_DATA[block.ore].rarity)}})
      </span><br>
      Health: {{format(health.mul(block.health))}}/
      <gain-multi :multi="multi">
        {{format(health)}}
      </gain-multi><br>
      <b v-if="block.treasure" style='color: gold'>Treasure inside!</b>
    </div>
  </div>
  `,
  setup() {
    return {
      Decimal,
      blockHovered,
      getRarity,
      ORE_DATA,
      format
    };
  }
};
setupVue.Block = {
  props: ["width", "height", "x", "y"],
  computed: {
    block() {
      return player.quarry.map?.[this.y]?.[this.x];
    },
    health() {
      return BLOCK_STATS?.[this.y]?.[this.x]?.value();
    },
    style() {
      const layerColor = this.block.voided
        ? "#000"
        : LAYER_DATA[this.block.layer].color ?? "white";
      const oreColor = ORE_DATA[this.block.ore]?.color ?? "transparent";
      const treasureColor = this.block.treasure ? "#ffefbf" : "#0001";
      const health = D(this.block.health).pow(0.5).max(0).min(1).toNumber();
      const exposedColor = isBlockExposed(this.x, this.y)
        ? "transparent"
        : "#0007";

      if (health > 0)
        return {
          // why linear gradient on the _same_ thing
          background: `
            linear-gradient(#0003, #0003),
            linear-gradient(#0003, #0003),
            linear-gradient(${exposedColor}, ${exposedColor}),
            linear-gradient(${oreColor}, ${oreColor}),
            linear-gradient(${layerColor}, ${layerColor}),
            linear-gradient(${treasureColor}, ${treasureColor}),
            linear-gradient(${layerColor}, ${layerColor})
          `,
          "background-position":
            "center, center, center, center, center, center, center",
          "background-size": `${(1 - health) * 100}% 2px, 2px ${
            (1 - health) * 100
          }%, 100% 100%, 50% 50%, calc(100% - 2px) calc(100% - 2px), 100% 100%, 100% 100%`,
          "background-repeat":
            "no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat"
        };
      else
        return {
          background: `
            linear-gradient(#000a, #000a),
            linear-gradient(${layerColor}, ${layerColor}),
            linear-gradient(#0003, #0003),
            linear-gradient(${layerColor}, ${layerColor})
          `,
          "background-position": "center, center, center, center",
          "background-size": `100% 100%, calc(100% - 2px) calc(100% - 2px), 100% 100%, 100% 100%`,
          "background-repeat": "no-repeat, no-repeat, no-repeat, no-repeat"
        };
    }
  },
  methods: {
    updateHover(x, y) {
      blockHovered[0] = x;
      blockHovered[1] = y;
    }
  },
  template: `
    <div 
      v-if="block !== undefined"
      @click="manualMine(x, y, block)"
      @mouseover="updateHover(x, y)"
      :style="style" 
      style="width: 32px; height: 32px; transition: background-size .5s">
    </div>
  `,
  setup() {
    return {
      manualMine
    };
  }
};
