import { computed } from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";
import { RESOURCES } from "./components/resources.js";
import { BUYABLES, UPGRADES } from "./components/buyables.js";

export const DATA = {
  resources: {},
  buyables: {},
  upgrades: {}
};

// Used to save performances from Vue with computed
// Not only it is for saving function calls.
// This assigns non-reactive data from database.

export function setupData() {
  for (const [id_group, group] of Object.entries(UPGRADES)) {
    const subdata = {};
    for (const [id, key] of Object.entries(group.data)) {
      subdata[id] = {
        amt: computed(() => key.amt),
        cost: computed(() => key.cost(key.amt)),
        eff: computed(() => key.eff(key.amt))
      };
    }
    DATA.upgrades[id_group] = subdata;
  }

  for (const [id_group, group] of Object.entries(BUYABLES)) {
    const subdata = {};
    for (const [id, key] of Object.entries(group.data)) {
      subdata[id] = {
        amt: computed(() => key.amt),
        cost: computed(() => key.cost(key.amt)),
        eff: computed(() => key.eff(key.amt))
      };
    }
    DATA.buyables[id_group] = subdata;
  }

  for (const [id, key] of Object.entries(RESOURCES)) {
    DATA.resources[id] = {
      amt: computed(() => key.amount),
      prod: computed(() => key.production)
    };
  }

  DATA.setup = true;
}

/*
const computedMap = new Map()
function assignComputed(key, func) {
  computedMap.set(key, computed(() => func()))
  Object.defineProperty(tmp, key, {
    value() {
      return computedMap.get(key).value
    },
    enumeratable: true
  })
}
 */
// note: could you use it for storing computed? yes.
// okay
