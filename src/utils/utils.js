import Decimal, { D } from "./break_eternity.js";

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

Decimal.prototype.modular = Decimal.prototype.mod = function (other) {
  other = new Decimal(other);
  if (other.eq(0)) return new Decimal(0);
  if (this.sign * other.sign === -1) return this.abs().mod(other.abs()).neg();
  if (this.sign === -1) return this.abs().mod(other.abs());
  return this.sub(this.div(other).floor().mul(other));
  //extension by MrRedShark77
};

// borrowed from profectus
// credit to thepaperpilot
export function createLazyProxy(objectFunc, baseObject = {}) {
  const obj = baseObject;
  let calculated = false;
  function calculateObj() {
    if (!calculated) {
      Object.assign(obj, objectFunc(obj));
      calculated = true;
    }
    return obj;
  }

  return new Proxy(obj, {
    get(target, key) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return calculateObj()[key];
    },
    set(target, key, value) {
      // TODO give warning about this? It should only be done with caution
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      calculateObj()[key] = value;
      return true;
    },
    has(target, key) {
      return Reflect.has(calculateObj(), key);
    },
    ownKeys() {
      return Reflect.ownKeys(calculateObj());
    },
    getOwnPropertyDescriptor(target, key) {
      if (!calculated) {
        Object.assign(obj, objectFunc(obj));
        calculated = true;
      }
      return Object.getOwnPropertyDescriptor(target, key);
    }
  });
}

export function applyScaling(value, threshold, strength) {
  value = D(value);
  threshold = D(threshold);
  strength = D(strength);
  if (value > threshold)
    return value.pow(strength).times(threshold.pow(Decimal.dOne.sub(strength)));
  return value;
}
