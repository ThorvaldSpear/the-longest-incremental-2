import { D } from "../utils/break_eternity.js";
import { Resource } from "./resources.js";
import { player } from "../../player.js";

export const LAYERS = [];
export class Layer {
  constructor({
    name,
    currency,
    gainFormula,
    playerIndex,
    miscData,
    doPrestige = function () {},
    resetFunc = function () {},
    statsRecord = {}
  }) {
    // i really hope i'm donig this right
    //  hopefully
    // yeah you're probably right
    this.name = name;
    this.gainFormula = gainFormula;
    this.playerIndex = playerIndex;
    this.miscData = miscData;
    this.doPrestige = doPrestige;
    this.resetFunc = resetFunc;
    this.statsRecord = statsRecord;

    LAYERS.push(this);
    new Resource({
      name: currency,
      src: {
        parent: (_) => this,
        src: "amt"
      }
    });
  }
  get player() {
    return player?.[this.playerIndex];
  }
  get amount() {
    return this.player.amt;
  }
  get gain() {
    return this.gainFormula();
  }
  playerLayer() {
    return {
      upgrades: [],
      milestones: [],
      challenges: [],
      stats: {
        time: 0,
        times: 0,
        restart: 0,
        history: [], //for layer history
        max: 0
      },
      ...this.miscData()
    };
  }
  gainCurrency() {
    const player = this.player;
    if (this.gainFormula) player.amt = D(player.amt ?? 0).add(this.gain);
  }
  doPrestige() {}
}

function layerExist(x) {
  return player?.[LAYERS[x].playerIndex] !== undefined;
}

function layerUnl(x) {
  return layerPlayer(x)?.did;
}

function layerGot(x) {
  return getHighestLayer() >= x;
}

function layerPlayer(x) {
  return player?.[LAYERS[x].playerIndex];
}

function setupLayer(x) {
  let data = LAYERS[x].playerLayer();
  player[LAYERS[x].playerIndex] = data;
  return data;
}

function doLayerReset(layer, force) {
  if (!force) {
    const layerPlayer = layerExist(layer)
      ? layerPlayer(layer)
      : setupLayer(layer);
    layerPlayer.did = true;
  }
  for (let toReset = layer; toReset > 0; toReset--) {
    recordLayerStats(layer, toReset, force);
    if (toReset > 1 && layerExist(toReset - 1)) {
      const priorLayerPlayer = layerPlayer(toReset - 1);
      delete priorLayerPlayer.amt;
      delete priorLayerPlayer.did;
    }
    LAYERS[toReset].resetFunc();
  }
}

function recordLayerStats(toReset, layer, force) {
  const layerPlayerStats = layerPlayer(layer).stats;
  if (toReset > layer) {
    force = true;
    layerPlayerStats.max = 0;
  }
  if (!force) {
    const record = Object.assign(LAYERS[layer].statsRecord.reset(), {
      time: layerPlayerStats.time
    });
    layerPlayerStats.stats.history.push(record);
    player.stats.history.push([layer, record]);
  }

  layerPlayerStats.time = 0;
  layerPlayerStats[force ? "restart" : "times"]++;
}

function getHighestLayer() {
  for (let layer = LAYERS.length - 1; layer >= 0; layer--) {
    if (layerUnl(layer)) return layer;
  }
  return 0;
}

function recordLayerStatsTick(layer, diff, points) {
  if (!layerExist(layer)) return;
  const layerPlayerStats = layerPlayer(layer).stats;
  layerPlayerStats.time += diff;
  layerPlayerStats.max = D(player.points).max(layerPlayerStats.max);
  LAYERS[layer].statsRecord.tick();
}
