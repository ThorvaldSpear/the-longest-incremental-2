import { format } from "../../utils/format.js";
import Decimal, { D } from "../../utils/break_eternity.js";
import { random } from "../../utils/utils.js";

import { player } from "../../player.js";
import {
  Buyable,
  BUYABLES,
  getBuyable,
  getBuyableEff,
  getUpgradeEff,
  hasUpgrade
} from "../../components/buyables.js";
import { Resource, RESOURCES } from "../../components/resources.js";

import {
  QUARRY_SIZE,
  doQuarryTick,
  getOreGain,
  getBlockHealth
} from "./quarry.js";
import { getTreasure } from "./treasures.js";

//Make sure to add assignation too
class Miner extends Buyable {
  constructor(obj) {
    super(obj);
    this.x = obj.x;
    this._eff = this.eff;
    this.eff = (amt) => {
      let mul = this._eff(amt).mul(getUpgradeEff("GreenPapers", 0));
      if (hasUpgrade("GreenPapers", 7))
        mul = mul.mul(getUpgradeEff("GreenPapers", 7));
      return mul;
    };
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
      .map((_, ind) => {
        let id = player.quarry.map
          .map((i) => i[ind])
          .findIndex((i) => Decimal.gt(i.health, 0));
        return [id, player.quarry.map[id][ind]];
      });
    while (pick?.[1] === undefined) pick = random(choice);

    const eff = getBuyableEff(this.group, this.x);
    const maxHealth = getBlockHealth(
      Decimal.add(player.quarry.depth, pick[0]),
      pick[1].layer,
      pick[1].ore
    );
    const damage = eff.mul(hits).div(maxHealth).min(pick[1].health);
    pick[1].health = Decimal.sub(pick[1].health, damage).min(1);
    if (pick[1].ore) {
      RESOURCES[pick[1].ore.toLowerCase()].add(
        damage.mul(maxHealth).mul(getOreGain(pick[1].ore))
      );
    }
    if (pick[1].health.lte(0)) {
      pick[1].health = D(0);
      player.stats.mined++;
      if (pick[1].treasure)
        getTreasure(Decimal.add(player.quarry.depth, pick[0]), pick[1].layer);
    }
  }
}

export function getMiner(x) {
  return getBuyable("Miners", x);
}

export function getMinerSpeed(x) {
  let mul = getUpgradeEff("GreenPapers", 1);
  return mul;
}

export function getMinerEff(x) {
  return getBuyableEff("Miners", x);
}

RESOURCES.mana = new Resource({
  name: "Mana",
  color: "blue",
  src: {
    parent: () => player.miners,
    id: "mana"
  },
  prodFunc() {
    return D(1e3).pow(D(player.quarry.depth).div(50)).sub(1).div(100);
  },
  based: "Quarry Depth"
});

BUYABLES.Miners = {
  res: "mana",
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
      name: "Efficient Miner",
      cost: (lvl) => lvl.add(1).pow(4).add(99),
      eff: (lvl) => D(lvl),
      desc(eff) {
        return `to 1 ore on the topmost layer`;
      },
      unl: () => getMiner(1).amt.gte(1),
      group: "Miners",
      speed: 3,
      x: 2
    }),
    new Miner({
      name: "Ranged Miner",
      cost: (lvl) => lvl.add(1).pow(4).add(299),
      eff: (lvl) => D(lvl).mul(5),
      desc(eff) {
        return `to 1 block on the topmost layer + 1/2 damage to 4 adjacent blocks`;
      },
      unl: () => getMiner(2).amt.gte(1),
      group: "Miners",
      speed: 0.125,
      x: 3
    })
  ]
};

export function doMine(diff) {
  doQuarryTick(diff);
}
