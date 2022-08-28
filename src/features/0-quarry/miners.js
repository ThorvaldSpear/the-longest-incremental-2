import { format } from "../../utils/format.js";
import Decimal, { D } from "../../utils/break_eternity.js";
import { random } from "../../utils/utils.js";

import { player } from "../../player.js";
import {
  Buyable,
  BUYABLES,
  getBuyable,
  getBuyableEff
} from "../../components/buyables.js";
import { Resource, RESOURCES } from "../../components/resources.js";

import { QUARRY_SIZE, doQuarryTick } from "./quarry.js";

//Make sure to add assignation too
class Miner extends Buyable {
  constructor(obj) {
    super(obj);
    this.progress = Decimal.dZero;
  }
  hit(diff, x) {
    if (Decimal.eq(this.player[this.name.toLowerCase()] ?? 0, 0)) return;
    // eff of miner????
    const speed = getMinerSpeed(x);
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

    const eff = getBuyableEff(this.group, x);
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
  return D(1);
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
        return `${format(eff)} hit/s to 1 block`;
      },
      unl: () => true,
      group: "Miners"
    }),
    new Miner({
      name: "Surface Miner",
      cost: (lvl) => lvl.add(1).pow(4),
      eff: (lvl) => D(lvl),
      desc(eff) {
        return `${format(eff)} hit/s to 1 block in first 3 rows`;
      },
      unl: () => getMiner(0).amt.gte(1),
      group: "Miners"
    }),
    new Miner({
      name: "Veining Miner",
      cost: (lvl) => lvl.add(1).pow(4).mul(3),
      eff: (lvl) => D(lvl).mul(3),
      desc(eff) {
        return `${format(eff)} hit/s to 1 layer block`;
      },
      unl: () => getMiner(1).amt.gte(1),
      group: "Miners"
    }),
    new Miner({
      name: "Efficient Miner",
      cost: (lvl) => lvl.add(2).pow(4),
      eff: (lvl) => D(lvl).mul(2),
      desc(eff) {
        return `${format(eff)} hit/s to 1 ore`;
      },
      unl: () => getMiner(2).amt.gte(1),
      group: "Miners"
    }),
    new Miner({
      name: "Ranged Miner",
      cost: (lvl) => lvl.add(2).pow(4).mul(3),
      eff: (lvl) => D(lvl),
      desc(eff) {
        return `${format(eff)} hit/s to 1 block<br>
          +50% of hits to 2 nearest blocks`;
      },
      unl: () => getMiner(3).amt.gte(1),
      group: "Miners"
    })
  ]
};

export function doMine(diff) {
  doQuarryTick(diff);
}
