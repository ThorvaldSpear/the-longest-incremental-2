import { setupVue } from "../setup.js";
import { DATA } from "../tmp.js";
import Decimal, { D } from "../utils/break_eternity.js";
import { format } from "../utils/format.js";

export class Resource {
  constructor({ name, color, src, prodFunc }) {
    this.name = name;
    this.color = color ?? "var(--font-color)";
    this.src = src; ///{parent, id} -> data
    this.prodFunc = prodFunc ?? (() => D(0));
  }

  get amt() {
    return D(this.src.parent()?.[this.src.id] ?? 0);
  }
  set amt(x) {
    if (D(x).eq(0)) delete this.src.parent()[this.src.id];
    else this.src.parent()[this.src.id] = D(x);
    // to do: implement reactive Decimal.prototype.set
  }
  get production() {
    return D(this.prodFunc());
  }

  set(x) {
    this.amt = x;
  }
  add(x) {
    this.amt = this.amt.add(x);
  }
  sub(x) {
    this.amt = this.amt.sub(x);
  }
  gte(x) {
    return this.amt.gte(x);
  }
}

export const RESOURCES = {};

setupVue.resource = {
  props: ["name"],
  template: `
    <div>
      <span class="resource">
        <b :style="{ color: resource_data.color }">
          {{format(resource.amt.value)}} 
        </b>
        {{resource_data.name}} 
        <span v-if="Decimal.gt(resource.prod.value, 0)" 
              :style="{ color: resource_data.color }"
              style="font-size: 90%">
          (+{{format(resource.prod.value)}}/sec)
        </span>
      </span>
    </div>
  `,
  //fixing later
  //<span v-if="resource.prod.value.gt(0)"> (+{{resource.value.prod.format()}}/s)</span>
  setup(props) {
    const resource = DATA.resources[props.name];
    const resource_data = RESOURCES[props.name];
    return {
      Decimal,
      resource,
      resource_data,
      format
    };
  }
};
