import { player, production } from "./player.js";
import { D } from "../utils/break_eternity.js";
import { computed } from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";
// D is named, not default
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
  get production() {
    return D(this.prodFunc.value);
  }

  set(x) {
    this.src.parent()[this.src.id] = D(x);
  }
  add(x) {
    return this.set(this.amount.add(x));
  }
  sub(x) {
    return this.set(this.amount.sub(x));
  }
  gte(x) {
    return this.amount.gte(x);
  }
}

export const RESOURCES = {
  dirt: new Resource({
    name: "Dirt",
    color: "gold",
    src: {
      parent: () => player,
      id: "points"
    },
    prodFunc: production
  })
};
