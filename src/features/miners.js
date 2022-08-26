import { computed } from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";
import { D } from "../utils/break_eternity.js";
import { format } from "../utils/format.js";
import { player } from "./player.js";
import { RESOURCES } from "./resources.js";

/**
 * The Buyable class for creating Miners.
 */
class Buyable {
  constructor({ name, group, unl, cost, eff, desc }) {
    this.name = name;
    this.group = group;
    this.unl = unl;
    this.cost = computed(() => cost(this.amt));
    this.eff = computed(() => eff(this.amt));
    this.desc = computed(() => desc(this.eff.value));
  }

  get res() {
    return RESOURCES[BUYABLES[this.group].res];
  }
  get player() {
    return BUYABLES[this.group].player();
  }
  get amt() {
    return D(this.player[this.name.toLowerCase()] ?? 0);
  }

  canBuy() {
    return this.res.gte(this.cost.value);
  }
  buy() {
    if (!this.unl.value) return;
    if (!this.canBuy()) return;
    this.res.sub(this.cost.value);
    this.player[this.name.toLowerCase()] = this.amt.add(1);
  }
}

function getMiner(x) {
  return getBuyable("Miners", x);
}

export function getMinerEff(x) {
  return getBuyableEff("Miners", x);
}

function getBuyable(group, x) {
  return BUYABLES[group].data[x];
}

export function getBuyableEff(group, x) {
  return getBuyable(group, x).eff.value;
}

export const BUYABLES = {
  Miners: {
    res: "dirt",
    player: () => player.miners,
    data: [
      // @type {Array<Buyable>}
      new Buyable({
        name: "Novice Miner",
        cost: (lvl) => (D(lvl).eq(0) ? D(0) : D(1.4).pow(lvl).mul(5)),
        eff: (lvl) => D(lvl),
        desc(eff) {
          return `+${format(eff)}/s`;
        },
        unl: computed(() => true),
        group: "Miners"
      }),
      new Buyable({
        name: "Efficient Miner",
        cost: (lvl) => D(1.4).pow(lvl).mul(100),
        eff: (lvl) => D(lvl).mul(3),
        desc(eff) {
          return `+${format(eff)}/s`;
        },
        unl: computed(() => getMiner(0).amt.gt(1)),
        group: "Miners"
      }),
      new Buyable({
        name: "Strong Miner",
        cost: (lvl) => D(1.6).pow(lvl).mul(1e3),
        eff: (lvl) => D(lvl).mul(10),
        desc(eff) {
          return `+${format(eff)}/s`;
        },
        unl: computed(() => getMiner(1).amt.gt(1)),
        group: "Miners"
      }),
      new Buyable({
        name: "Ranged Miner",
        cost: (lvl) => D(1.8).pow(lvl).mul(1e4),
        eff: (lvl) => D(lvl).mul(30),
        desc(eff) {
          return `+${format(eff)}/s`;
        },
        unl: computed(() => getMiner(2).amt.gt(1)),
        group: "Miners"
      })
    ]
  }
};
