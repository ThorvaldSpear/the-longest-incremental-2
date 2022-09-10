import { RESOURCES } from "../../components/resources.js";
import { hasUpgrade } from "../../components/buyables.js";
import { player } from "../../player.js";
import { D } from "../../utils/break_eternity.js";
import { format } from "../../utils/format.js";
import { notify } from "../../utils/notify.js";
import { obtainInventory } from "./inventory.js";
import { getOreWorthMul, LAYER_DATA } from "./quarry.js";

const TREASURE_DATA = {
  greenPapers: {
    range: [0, Infinity],
    rarity: 1,
    worth(depth, layer) {
      return (
        D(1e3)
          .pow(D(depth).div(50))
          .mul(LAYER_DATA[layer].health)
          //.mul(getOreGain(null, true))
          .mul(getOreWorthMul())
          .div(3)
      );
    },
    obtain(depth, layer) {
      const worth = this.worth(depth, layer);
      RESOURCES.greenPaper.add(worth);
      notify("You have obtained " + format(worth) + " Green Papers!");
    }
  },
  map: {
    range: [25, Infinity],
    rarity: 5,
    obtain(depth) {
      if (hasUpgrade("GreenPapers", 3)) {
        notify("You have obtained a new map at depth: " + format(depth, 0) + "!");
        obtainInventory("map", {
          depth: depth,
          freq: (1 + Math.random() / 8) ** 3,
          luck: (1 + Math.random() / 8) ** 2,
          health: (1 + Math.random() / 8) ** 2
        });
      } else {
        notify("You obtained something, but you dont have the required upgrade.")
      }
    }
  }
  /*artifact1: {
    unique: true,
    rarity: 10,
    range: [101, Infinity],
    name: "Green Papers",
  }*/
};

function generateTreasure(depth) {
  let get = [];
  let random = Math.random();
  for (let [index, key] of Object.entries(TREASURE_DATA)) {
    if (D(depth).lt(key.range[0]) || D(depth).gt(key.range[1])) continue;
    if (1 / random < key.rarity) continue;
    get.push(index);
  }
  return get;
}

export function getTreasure(depth, layer) {
  for (let i of generateTreasure(depth)) TREASURE_DATA[i].obtain(depth, layer);
  player.stats.treasures++;
}
