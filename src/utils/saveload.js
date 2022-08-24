import Decimal from "./break_eternity.js";
import { Layer, layers } from "./layer.js"; // wtf why is it gray
let player = {}; // i really really really really hope my syntax is riht
const SAVE_KEY = "the_longest_incremental_2";
function startPlayer() {
  // wtf why
  // temp????????????????????????????
  // that's just the name of the fucking playre var
  const temp = {};
  temp.layers = [];
  for (let i in layers) {
    temp.layers.push(layers[i].playerLayer());
  }
} // gwa gwa
/**
 * Recursively merges defaultData with newData.
 * @param {Record<PropertyKey, unkown>} defaultData Object containing the default data.
 * @param {Record<PropertyKey, unkown>} newData New data to merge with the default one.
 */
function fixData(defaultData, newData) {
  for (const item in defaultData) {
    if (defaultData[item] === null) {
      if (newData[item] === undefined) newData[item] = null;
    } else if (Array.isArray(defaultData[item])) {
      if (newData[item] === undefined) newData[item] = defaultData[item];
      else fixData(defaultData[item], newData[item]);
    } else if (!!defaultData[item] && typeof defaultData[item] === "object") {
      if (newData[item] === undefined || typeof defaultData[item] !== "object")
        newData[item] = defaultData[item];
      else fixData(defaultData[item], newData[item]);
    } else {
      if (newData[item] === undefined) newData[item] = defaultData[item];
    }
  }
}

/**
 * Saves player data to localStorage.
 */
function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(player));
}

/**
 * Laads save from localStorage if it exsists, else default save is loaded.
 */
function load() {
  const save = JSON.parse(localStorage.getItem(SAVE_KEY));
  if (!save) player = startPlayer();
  else player = Object.assign(startPlayer(), save);
  fixData(startPlayer(), player);
}

/**
 * Imports save provided by the user.
 */
export function importSave() {
  player = JSON.parse(prompt("input your save here"));
  save();
  window.location.reload();
}

/*
 * Exports save to clipboard.
 */
export async function exportSave() {
  try {
    await navigator.clipboard.writeText(JSON.stringify(player));
    console.log("Exported.");
  } catch (error) {
    console.log("Failed.", error);
  }
}
// this could still technically work due to the fact that toJSON is a thign in classes
// actually for any object toJSON works
/**
 * autoSave interval
interval
*/
export const saveInterval = setInterval(save, 5000);

load();
