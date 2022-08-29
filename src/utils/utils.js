import Decimal from "./break_eternity.js";

export function random(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function countDecimals(value) {
  value = new Decimal(value);
  let text = value.toString().replace(/(0){5,1000}(.*)/g, "");
  // verify if number 0.000005 is represented as "5e-6"
  if (text.indexOf("e-") > -1) {
    return parseInt(text.split("e-")[1], 10);
  }
  // count decimals for number in representation like "0.123456"
  if (value.floor().neq(value)) {
    return text.split(".")[1].length || 0;
  }
  return 0;
}
