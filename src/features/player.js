import {
  reactive,
  computed
} from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";
import { miners } from "./miners.js";
import { D } from "../utils/break_eternity.js";
export const player = (window.player = reactive({
  points: D(0),
  lastTick: Date.now(),
  stats: {
    time: 0,
    max: 0,
    history: [] //for global history
  }
}));
export const production = computed(() => {
  let prod = D(0);
  prod = prod.plus(miners[0].eff.value);
  prod = prod.plus(miners[1].eff.value);
  prod = prod.plus(miners[2].eff.value);
  prod = prod.mul(miners[3].eff.value);

  return prod;
});

export function runGame() {
  const diff = (Date.now() - player.lastTick) / 1000;
  player.lastTick = Date.now();
  player.points = player.points.plus(production.value.mul(diff));
  requestAnimationFrame(runGame);
}
