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

import { QUARRY_SIZE, doQuarryTick } from "./quarry.js";

//Make sure to add assignation too
class Miner extends Buyable {
  constructor(obj) {
    super(obj);
    this.x = obj.x;
    this._eff = this.eff;
    this.eff = () => this._eff(this.amt).mul(getUpgradeEff("GreenPapers", 0));
    this._desc = this.desc;
    this.desc = () => `${this._desc(this.eff(this.amt))}<br><br>
    Currently drills every ${format(getMinerSpeed(this.x).recip())} seconds.`;
    this.progress = Decimal.dZero;
  }
  hit(diff) {
    if (Decimal.eq(this.player[this.name.toLowerCase()] ?? 0, 0)) return;
    // eff of miner????
    const speed = getMinerSpeed(this.x);
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
    const damage = eff.mul(hits);
    pick.health = Decimal.sub(pick.health, damage);
    if (pick.health.lte(0)) {
      pick.health = D(0);
      player.stats.mined++;

      RESOURCES[pick.layer.toLowerCase()].add(1);
      if (pick.ore) RESOURCES[pick.ore.toLowerCase()].add(1);
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

RESOURCES.blocks = new Resource({
  name: "blocks",
  color: "black",
  src: {
    parent: () => player.miners,
    id: "blocks"
  }
});
BUYABLES.Miners = {
  res: "gold",
  player: () => player.miners.amt,
  data: [
    // @type {Array<Buyable>}
    new Miner({
      name: "Novice Miner",
      cost: (lvl) => (D(lvl).eq(0) ? D(0) : lvl.pow(4)),
      eff: (lvl) => D(lvl),
      desc(eff) {
        return `Deals ${format(eff)} damage`;
      },
      group: "Miners",
      x: 0
    }),
    new Miner({
      name: "Surface Miner",
      cost: (lvl) => lvl.add(1).pow(4),
      eff: (lvl) => D(lvl),
      desc(eff) {
        return `Deals ${format(eff)} damage to the first 3 rows`;
      },
      unl: () => getMiner(0).amt.gte(1),
      group: "Miners",
      x: 1
    }),
    new Miner({
      name: "Veining Miner",
      cost: (lvl) => lvl.add(1).pow(4).mul(2),
      eff: (lvl) => D(lvl).mul(3),
      desc(eff) {
        return `Deals ${format(eff)} damage to 1 layer block`;
      },
      unl: () => getMiner(1).amt.gte(1),
      group: "Miners",
      x: 2
    }),
    new Miner({
      name: "Efficient Miner",
      cost: (lvl) => lvl.add(2).pow(4),
      eff: (lvl) => D(lvl).mul(2),
      desc(eff) {
        return `Deals ${format(eff)} damage to 1 ore`;
      },
      unl: () => getMiner(2).amt.gte(1),
      group: "Miners",
      x: 3
    }),
    new Miner({
      name: "Ranged Miner",
      cost: (lvl) => lvl.add(2).pow(4).mul(3),
      eff: (lvl) => D(lvl),
      desc(eff) {
        return `Deals ${format(eff)} damage to 1 block<br>
          50% of damage also goes the to 2 nearest blocks`;
      },
      unl: () => getMiner(3).amt.gte(1),
      group: "Miners",
      x: 4
    })
  ]
};

export function doMine(diff) {
  doQuarryTick(diff);
}
