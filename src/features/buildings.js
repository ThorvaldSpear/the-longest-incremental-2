import {
  computed,
  ref
} from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";
import { player } from "./player.js";
/**
 * The building class for creating buildings.
 */
class Building {
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
 * An array containing all the buildings.
 * @type {Array<Building>}
 */
export const buildings = [
  new Building({
    name: "The first one",
    cost(lvl) {
      return lvl;
    },
    eff(lvl) {
      return lvl;
    },
    desc(eff) {
      return `+${eff}/s`;
    },
    unl: computed(() => true),
    canBuy(cost) {
      return player.points >= cost;
    },
    doBuy(cost) {
      player.points -= cost;
    }
  })
];
