import { format } from "../../utils/format.js";
import Decimal, { D } from "../../utils/break_eternity.js";
import { random } from "../../utils/utils.js";

import { player } from "../../player.js";
import {
  Buyable,
  BUYABLES,
  getBuyable,
  getBuyableEff,
  getUpgradeEff
} from "../../components/buyables.js";
import { Resource, RESOURCES } from "../../components/resources.js";

import { ORE_DATA, LAYER_DATA, QUARRY_SIZE, doQuarryTick } from "./quarry.js";
import { getTreasure } from "./treasures.js";

//Make sure to add assignation too
class Miner extends Buyable {
  constructor(obj) {
    super(obj);
    this.x = obj.x;
    this._eff = this.eff;
    this.eff = (amt) =>
      this._eff(amt).mul(
        getUpgradeEff("GreenPapers", 0).mul(getUpgradeEff("GreenPapers", 7))
      );
    this._desc = this.desc;
    this.desc = (eff) =>
      `${format(eff)} damage/hit × ${format(
        getMinerSpeed(this.x).mul(this.speed)
      )} hits/sec<br>${this._desc(eff)}`;
    this.progress = Decimal.dZero;
    this.speed = obj.speed || 1;
    this.diffDesc = "damage/hit";
  }
  hit(diff) {
    if (Decimal.eq(this.player[this.name.toLowerCase()] ?? 0, 0)) return;

    const speed = getMinerSpeed(this.x).mul(this.speed);
    this.progress = this.progress.plus(speed.mul(diff));
    const hits = this.progress.floor();
    if (hits.lt(1)) return;
    this.progress = this.progress.sub(hits);

    player.stats.hits = hits.add(player.stats.hits);

    let pick;
    const choice = Array(QUARRY_SIZE.width)
      .fill()
      .map((_, ind) =>
        player.quarry.map
          .map((i) => i[ind])
          .find((i) => Decimal.gt(i.health, 0))
      );
    while (pick === undefined) pick = random(choice);

    const eff = getBuyableEff(this.group, this.x);
    const damage = eff.mul(hits).min(pick.health);
    pick.health = Decimal.sub(pick.health, damage);
    RESOURCES[pick.layer.toLowerCase()].add(
      damage.div(LAYER_DATA[pick.layer].sparseness)
    );
    if (pick.ore)
      RESOURCES[pick.ore.toLowerCase()].add(
        damage.div(ORE_DATA[pick.ore].sparseness).mul(getOreGain(pick.ore))
      );
    if (pick.health.lte(0)) {
      pick.health = D(0);
      player.stats.mined++;
      if (pick.treasure) getTreasure(player.quarry.depth);
    }
  }
}

export function getMiner(x) {
  return getBuyable("Miners", x);
}

export function getMinerSpeed(x) {
  return getUpgradeEff("GreenPapers", 1);
}

export function getMinerEff(x) {
  return getBuyableEff("Miners", x);
}

export function getOreGain(ore) {
  let mul = getUpgradeEff("GreenPapers", 2);
  if (ORE_DATA[ore].rarity < 10) getUpgradeEff("GreenPapers", 5);
  return mul;
}

RESOURCES.labor = new Resource({
  name: "Labor",
  color: "blue",
  src: {
    parent: () => player.miners,
    id: "mana"
  },
  prodFunc() {
    return D(player.quarry.depth).plus(1).div(60);
  },
  based: "Quarry Depth"
});

BUYABLES.Miners = {
  res: "labor",
  player: () => player.miners.amt,
  data: [
    // @type {Array<Buyable>}
    new Miner({
      name: "Novice Miner",
      cost: (lvl) => (D(lvl).eq(0) ? D(0) : lvl.pow(4).add(9)),
      eff: (lvl) => D(lvl),
      desc(eff) {
        return `to 1 block on the topmost layer`;
      },
      group: "Miners",
      x: 0
    }),
    new Miner({
      name: "Stone Miner",
      cost: (lvl) => lvl.add(1).pow(4).add(9),
      eff: (lvl) => D(lvl).mul(2),
      desc(eff) {
        return `to 1 non-ore block on the topmost layer`;
      },
      unl: () => getMiner(0).amt.gte(1),
      group: "Miners",
      speed: 0.65,
      x: 1
    }),
    new Miner({
      name: "Veining Miner",
      cost: (lvl) => lvl.add(1).pow(4).add(29),
      eff: (lvl) => D(lvl).mul(2),
      desc(eff) {
        return `to 1 block on the 1st layer`;
      },
      unl: () => getMiner(1).amt.gte(1),
      group: "Miners",
      speed: 0.8,
      x: 2
    }),
    new Miner({
      name: "Efficient Miner",
      cost: (lvl) => lvl.add(1).pow(4).add(99),
      eff: (lvl) => D(lvl),
      desc(eff) {
        return `to 1 ore on the topmost layer`;
      },
      unl: () => getMiner(2).amt.gte(1),
      group: "Miners",
      speed: 3,
      x: 3
    }),
    new Miner({
      name: "Ranged Miner",
      cost: (lvl) => lvl.add(1).pow(4).add(299),
      eff: (lvl) => D(lvl).mul(5),
      desc(eff) {
        return `to 1 block on the topmost layer + 50% more damage to 4 adjacent blocks`;
      },
      unl: () => getMiner(3).amt.gte(1),
      group: "Miners",
      speed: 0.125,
      x: 4
    })
  ]
};

export function doMine(diff) {
  doQuarryTick(diff);
}
