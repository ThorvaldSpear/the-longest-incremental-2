import { player, generatePlayer } from "../features/player.js";
const SAVE_KEY = "the_longest_incremental_2";
/**
 * Recursively merges defaultData with newData.
 * @param {Record<PropertyKey, unkown>} defaultData Object containing the default data.
 * @param {Record<PropertyKey, unkown>} newData New data to merge with the default one.
 */

function fixData(obj, mergeFrom) {
  for (const item in mergeFrom) {
    const thing = mergeFrom[item];
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
function save() {
  console.log("saving triggered");
  localStorage.setItem(SAVE_KEY, JSON.stringify(player));
}

/**
 * Laads save from localStorage if it exsists, else default save is loaded.
 */
export function load() {
  const data = localStorage.getItem(SAVE_KEY);
  let save;
  if (!data) return;
  try {
    save = JSON.parse(data);
  } catch (e) {
    console.error("Your save is invalid.");
    return;
  }
  fixData(player, save);
}

/**
 * Imports save provided by the user.
 */
export function importSave() {
  player = JSON.parse(prompt("input your save here"));
  save();
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
