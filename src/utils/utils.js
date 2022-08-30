import Decimal from "./break_eternity.js";

export function random(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function countDecimals(value) {
  value = new Decimal(value);
  let text = value.toString();
  if (value.lt(1e-4)) return 0;
  // count decimals for number in representation like "0.123456"
  if (value.floor().neq(value)) {
    return text.split(".")[1].length || 0;
  }
  return 0;
}

export function getRarity(probability) {
  const rarities = [
    "Common",
    "Uncommon",
    "Rare",
    "Unique",
    "Epic",
    "Legendary",
    "Mythical",
    "Divine",
    "Almighty"
  ];
  return rarities[
    Math.min(
      Math.max(Math.floor(2 * Math.log10(probability) - 1), 0),
      rarities.length - 1
    )
  ];
}

export function isRarity(ore, name) {
  return getRarity(ore.rarity) === name;
}
