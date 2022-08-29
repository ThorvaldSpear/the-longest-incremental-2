import { RESOURCES } from "../../components/resources.js";
import { D } from "../../utils/break_eternity.js";
import { format } from "../../utils/format.js";
import { notify } from "../../utils/notify.js";

const TREASURE_DATA = {
  greenPapers: {
    range: [0, Infinity],
    rarity: 1,
    worth(depth) {
      return D(1);
    },
    obtain(depth) {
      const worth = this.worth(depth);
      RESOURCES.greenPaper.add(worth);
      notify("You have obtained " + format(worth) + " Green Papers!");
    }
  },
  map: {
    range: [25, Infinity],
    rarity: 5,
    obtain(depth) {
      notify("You have obtained a new map at depth: " + format(depth, 0) + "!");
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

export function getTreasure(depth) {
  for (let i of generateTreasure(depth)) TREASURE_DATA[i].obtain(depth);
}
