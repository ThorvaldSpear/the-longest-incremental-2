import { player, production } from "./player.js";
import { D } from "../utils/break_eternity.js";
// D is named, not default
import { computed } from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";

export class Resource {
  constructor({ name, src, prodFunc }) {
    this.name = name;
    this.src = src ?? (() => D(0));
    this.prodFunc = prodFunc ?? computed(() => D(0));
    // you're making it waaaaaaaaaaay more implicit
    // now you have to go to 10 different files to find where it is
    RESOURCES[this.name] = this;
  }
  get amount() {
    return D(this.src());
  }
  get production() {
    return D(this.prodFunc.value);
  }
}

export const RESOURCES = {};

new Resource({
  name: "Coins",
  src() {
    return player.points;
  },
  // production is a computed value ,not a function
  prodFunc: production
});
