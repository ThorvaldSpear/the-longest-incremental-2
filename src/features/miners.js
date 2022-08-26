import {
  computed,
  ref
} from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";
import { player } from "./player.js";
import { D } from "../utils/break_eternity.js";
import { format } from "../utils/format.js";
/**
 * The miner class for creating miners.
 */

function canBuyPoints(c) {
  return player.points.gte(c);
}

function doBuyPoints(c) {
  player.points = player.points.sub(c);
}

// shouldn't be specific to miner
// this works for every single buyable
// or leave it as-is if you want to name it "miner"
class Miner {
  constructor({ name, cost, eff, desc, unl, canBuy, doBuy, amt = 0 }) {
    this.name = name;
    this.unl = unl;
    this.amt = ref(amt);
    this.doBuy = doBuy;
    this.cost = computed(() => cost(this.amt.value));
    this.eff = computed(() => eff(this.amt.value));
    this.desc = computed(() => desc(this.eff.value));
    this.canBuy = computed(() => canBuy(this.cost.value));
  }

  buy() {
    if (!this.canBuy.value || !this.unl.value) return;
    this.doBuy(this.cost.value);
    this.amt.value++;
  }
}

/**
 * An array containing all the miners.
 * @type {Array<Miner>}
 */
export const miners = [
  new Miner({
    name: "Bitcoin Miner",
    cost: (lvl) => (D(lvl).eq(0) ? D(0) : D(1.4).pow(lvl).mul(5)),
    eff: (lvl) => D(lvl),
    desc(eff) {
      return `+${format(eff)}/s`;
    },
    unl: computed(() => true),
    canBuy: canBuyPoints,
    doBuy: doBuyPoints
  }),
  new Miner({
    // stuffs to go in here
    /* oh swagger functioner */
    // yep that's how you do it :)
    // ~~inflated game when~~
    // right now :cart_troll:
    name: "Ethereum Miner",
    cost: (lvl) => D(1.6).pow(lvl).mul(100),
    eff: (lvl) => D(lvl).mul(10),
    desc(eff) {
      return `+${format(eff)}/s`;
    },
    unl: computed(() => miners[0].amt.value >= 1),
    canBuy: canBuyPoints,
    doBuy: doBuyPoints
  }),
  new Miner({
    // stuffs to go in here
    /* oh swagger functioner */
    // yep that's how you do it :)
    // ~~inflated game when~~
    // right now :cart_troll:
    name: "Tether Miner",
    // you know this will inflate?
    // thats the point :cart_troll:
    // lmao
    // why don't you set the cost to 0
    // :troll_cart: giving you points every time you buy it
    cost: (lvl) => D(1.8).pow(lvl).mul(1e3),
    eff: (lvl) => D(lvl).mul(30),
    // LMAO
    // best way to earn points working in 2022 , 100% working , no viruses , free download , glitchless , unpatched , undetected
    desc(eff) {
      return `+${format(eff)}/s`;
    },
    unl: computed(() => miners[1].amt.value >= 1),
    canBuy: canBuyPoints,
    doBuy: doBuyPoints
  }),
  new Miner({
    // stuffs to go in here
    /* oh swagger functioner */
    // yep that's how you do it :)
    // ~~inflated game when~~
    // right now :cart_troll:
    name: "Hardware Booster",
    cost: (lvl) => D(1e4).mul(D(10).pow(lvl)),
    eff: (lvl) => D(2).pow(lvl), // funky effector
    desc(eff) {
      return `x${format(eff)}`;
    },
    unl: computed(() => miners[2].amt.value >= 1),
    canBuy: canBuyPoints,
    doBuy: doBuyPoints
  })
];
