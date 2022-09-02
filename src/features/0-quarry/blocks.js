import { setupVue } from "../../setup.js";

import { player } from "../../player.js";
import { DATA } from "../../tmp.js";

import Decimal, { D } from "../../utils/break_eternity.js";
import { format } from "../../utils/format.js";
import { generateGradient } from "../../utils/gradient.js";
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
import { getMinerEff } from "./miners.js";
import { getTreasure } from "./treasures.js";

/* -=- BLOCKS -=- */
function getBlockStrength(depth) {
  depth = getEffectiveDepth(depth);

  let ret = D(1e3).pow(Decimal.div(depth, 50)).div(10).add(0.9);
  return ret;
}

export function getBlockAmount(index) {
  return DATA.resources[index.toLowerCase()].amt.value;
}

export function getBlockHealth(depth, layer, ore) {
  let ret = getBlockStrength(depth).mul(LAYER_DATA[layer].health);
  ret = ret.div(DATA.setup ? getUpgradeEff("GreenPapers", 6) : 1);

  if (ore !== "") {
    ret = ret.mul(ORE_DATA[ore].health);
    if (inQuarryMap()) ret = ret.mul(player.quarry.inMap.health ?? 1);
  }
  return ret;
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

export function mineBlock(offset, block, damage) {
  const depth = getQuarryDepth().add(offset);
  const maxHealth = getBlockHealth(depth, block.layer, block.ore);
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

function manualMine(x, y, block) {
  if (player.miners.manualCooldown > 0) return;
  if (!isBlockExposed(x, y)) return;
  if (D(player.quarry.map[x][y].health).eq(0)) return;
  mineBlock(y, block, getMinerEff(0));
  player.miners.manualCooldown = 2;
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
              id: 5,
              type: "multiply"
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

function getBlockDataByValues(depth, layer, ore) {
  const y = player.quarry.map.find((i, ind) =>
    Decimal.sub(depth, getQuarryDepth()).eq(ind)
  );
  const x = y.find((i, ind) => i.layer === layer && i.ore === ore);
  return [player.quarry.map.indexOf(y), y.indexOf(x)];
}

/* -=- INSERT NEW CONTENT -=- */
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
        ? "black"
        : LAYER_DATA[this.block.layer].color ?? "white";
      const oreColor = ORE_DATA[this.block.ore]?.color ?? "transparent";
      const treasureColor = this.block.treasure ? "#ffefbf" : "#0001";
      const health = D(this.block.health).pow(0.5).max(0).min(1).toNumber();
      const isGreen =
        player.miners.manualCooldown === 0 && isBlockExposed(this.x, this.y);

      if (health > 0)
        return {
          // why linear gradient on the _same_ thing
          border: `1px solid ${isGreen ? "green" : layerColor}`,
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
          border: `1px solid black`,
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
  template: `
    <div v-if="block !== undefined" class="tooltip">
      <div @click="manualMine(x, y, block)" :style="style" style="width: 32px; height: 32px; transition: background-size .5s"></div>
      <span v-if="Decimal.gt(block.health, 0) && block.layer !== 'Bedrock'" class="tooltiptext">
        <b>Block Type: {{block.layer}}</b>
        <span v-if="block.voided">
          <br>This is a Void Block... (Collapse to proceed!)
        </span>
        <span v-else>
          <span v-if="block.ore !== ''">
            <br>Ore: {{block.ore}} ({{getRarity(ORE_DATA[block.ore].rarity)}})
          </span><br>
          Health: {{format(health.mul(block.health))}}/{{format(health)}}<br>
          <b v-if="block.treasure" style='color: gold'>Treasure inside!</b>
        </span>
      </span>
    </div>
  `,
  setup() {
    return {
      LAYER_DATA,
      ORE_DATA,
      Decimal,

      generateGradient,
      format,
      getRarity,
      manualMine
    };
  }
};
