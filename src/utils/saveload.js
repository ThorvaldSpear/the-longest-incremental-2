import { player, setupPlayer } from "../player.js";
import { notify } from "./notify.js";
const SAVE_KEY = "the_longest_incremental_2";
/**
 * Recursively merges defaultData with newData.
 * @param {Record<PropertyKey, unkown>} defaultData Object containing the default data.
 * @param {Record<PropertyKey, unkown>} newData New data to merge with the default one.
 */

function fixData(obj, mergeFrom) {
  for (const item in mergeFrom) {
    const thing = mergeFrom[item];
    // unknown key
    if (typeof thing === "object") {
      fixData(obj[item], thing);
    } else {
      obj[item] = thing;
    }
  }
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
  localStorage.setItem(SAVE_KEY, JSON.stringify(player));
}

/**
 * Laads save from localStorage if it exsists, else default save is loaded.
 */
export function load(save) {
  // csb does not understand ?? lmao
  const data = save ?? localStorage.getItem(SAVE_KEY);
  // can only be null if it is not found
  if (data === null || data === "") return;
  try {
    const save = JSON.parse(data);
    // wrong way
    // you will merge player
    fixData(player, save);
    notify("Game loaded.");
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
    await navigator.clipboard.writeText(JSON.stringify(player));
    notify("Save exported!");
  } catch (error) {
    notify("For some reason the game failed to export your save.");
    console.error(error);
  }
}

export function hardReset() {
  if (
    !confirm(
      "Are you sure? This is not the soft reset you are looking for. " +
        "THIS WILL RESET THE ENTIRE GAME WITH NO REWARD."
    )
  )
    return;
  Object.assign(player, setupPlayer());
  notify("Hard reset performed.");
  save();
}
window.hardReset = hardReset;
// this could still technically work due to the fact that toJSON is a thign in classes
// actually for any object toJSON works
/**
 * autoSave interval
interval
*/
export const saveInterval = setInterval(save, 3e4);
window.onbeforeunload = save;
