import { player, production } from "./player.js";
import { D } from "../utils/break_eternity.js";
import { computed } from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";

export class Resource {
  constructor({ name, color, src, prodFunc }) {
    this.name = name;
    this.color = color ?? "var(--font-color)";
    this.src = src; ///{parent, id} -> data
    this.prodFunc = computed(() => prodFunc());
  }

  get amount() {
    return D(this.src.parent()[this.src.id]);
  }
  set amount(x) {
    this.src.parent()[this.src.id] = D(x);
    // to do: implement reactive Decimal.prototype.set
  }
  get production() {
    return D(this.prodFunc.value);
  }

  set(x) {
    this.amount = x;
  }
  add(x) {
    this.amount = this.amount.add(x);
  }
  sub(x) {
    this.amount = this.amount.sub(x);
  }
  gte(x) {
    return this.amount.gte(x);
  }
}

export const RESOURCES = {
  dirt: new Resource({
    name: "Dirt",
    color: "brown",
    src: {
      parent: () => player,
      id: "points"
    },
    prodFunc: production
  })
};
