import { reactive } from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";
import { getMinerEff } from "./miners.js";
import { RESOURCES } from "./resources.js";
import { D } from "../utils/break_eternity.js";


export function generatePlayer() {
  return {
    points: D(0),
    miners: {},
    lastTick: Date.now(),
    stats: {
      time: 0,
      max: 0,
      history: [] //for global history
    }
  }
}
export const player = (window.player = reactive(generatePlayer()));

export function production() {
  let prod = D(0);

  prod = prod.plus(getMinerEff(0));
  prod = prod.plus(getMinerEff(1));
  prod = prod.plus(getMinerEff(2));
  prod = prod.mul(getMinerEff(3));

  return prod;
}

export function runGame() {
  const diff = (Date.now() - player.lastTick) / 1000;
  player.lastTick = Date.now();

  for (const res of Object.values(RESOURCES))
    res.add(res.prodFunc.value.mul(diff));
  requestAnimationFrame(runGame);
}
