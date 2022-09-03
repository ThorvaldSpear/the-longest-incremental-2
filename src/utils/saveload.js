import { player, setupPlayer } from "../player.js";
import { notify } from "./notify.js";
import { updateVer } from "./version.js";
import LZString from "./lz-string.js";

const SAVE_KEY = "the_longest_incremental_2";

/**
 * Recursively merges defaultData with newData.
 * @param {Record<PropertyKey, unkown>} defaultData Object containing the default data.
 * @param {Record<PropertyKey, unkown>} newData New data to merge with the default one.
 */
function fixData(obj, mergeFrom) {
  for (const item in mergeFrom) {
    const thing = mergeFrom[item];
    if (typeof thing === "object" && thing !== null) {
      if (thing.length !== undefined && obj.length === undefined) {
        obj[item] = thing;
      } else if (thing.length === undefined && obj.length !== undefined) {
        obj[item] = thing;
      } else {
        fixData(obj[item], thing);
      }
    } else {
      obj[item] = thing;
    }
  }
}

function compress() {
  return LZString.compressToBase64(JSON.stringify(player));
}

function decompress(save) {
  return JSON.parse(LZString.decompressFromBase64(save));
}
/**
 * Saves player data to localStorage.
 */
let canSave = true;
export function save(manual) {
  if (!canSave) {
    notify(
      "For some reason, the game has disabled saving. Please check with the developers!"
    );
    return;
  }
  if (manual) notify("Game saved.");
  localStorage.setItem(SAVE_KEY, compress());
}

/**
 * Laads save from localStorage if it exsists, else default save is loaded.
 */
export function load(save) {
  // csb does not understand ?? lmao
  const data = save || localStorage.getItem(SAVE_KEY);
  // can only be null if it is not found
  if (data === null || data === "") return;
  try {
    const save = data[0] === "{" ? JSON.parse(data) : decompress(data);
    fixData(player, save);
    notify("Game loaded.");
    updateVer();
  } catch (e) {
    console.error(e);
    notify("Your save is invalid. Sorry!");
    //canSave = false;
  }
}

/**
 * Imports save provided by the user.
 */
export function importSave() {
  load(prompt("Input your save here!"));
  save();
}

/*
 * Exports save to clipboard.
 */
export async function exportSave() {
  try {
    await navigator.clipboard.writeText(compress());
    notify("Save exported!");
  } catch (error) {
    notify("For some reason the game failed to export your save.");
    console.error(error);
  }
}

export function hardReset(force = false) {
  if (
    force ||
    !confirm(
      "Are you sure? This is not the soft reset you are looking for. " +
        "THIS WILL RESET THE ENTIRE GAME WITH NO REWARD."
    )
  )
    return;
  Object.assign(player, setupPlayer());
  if (!force) notify("Welcome back to the beginning.");
  save();
}
// this could still technically work due to the fact that toJSON is a thing in classes
// actually for any object toJSON works
/**
 * autoSave interval
interval
*/
export const saveInterval = setInterval(save, 3e4);
window.onbeforeunload = save;
