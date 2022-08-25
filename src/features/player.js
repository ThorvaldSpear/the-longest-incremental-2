import { reactive, computed } from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";
import {buildings} from './buildings.js'

export const player = (window.player = reactive({ points: 0, lastTick: Date.now() }));
const production = computed(() => {
  return buildings[0].eff.value
})

export function runGame() {
  const diff = (Date.now() - player.lastTick)/1000
  player.lastTick = Date.now()
  player.points += diff * production.value
  requestAnimationFrame(runGame)
}