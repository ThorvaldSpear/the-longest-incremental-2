import { setupVue } from "../setup.js";
import { DATA } from "../tmp.js";
import { D } from "../utils/break_eternity.js";
import { format } from "../utils/format.js";

export class Resource {
  constructor({ name, color, src, prodFunc }) {
    this.name = name;
    this.color = color ?? "var(--font-color)";
    this.src = src; ///{parent, id} -> data
    this.prodFunc = prodFunc ?? (() => D(0));
  }

  get amount() {
    return D(this.src.parent()?.[this.src.id] ?? 0);
  }
  set amount(x) {
    if (D(x).eq(0)) delete this.src.parent()[this.src.id];
    else this.src.parent()[this.src.id] = D(x);
    // to do: implement reactive Decimal.prototype.set
  }
  get production() {
    return D(this.prodFunc());
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

export const RESOURCES = {};

setupVue.resource = {
  props: ["name"],
  template: `
    <div>
      <span style='font-size: 18px'>
        <b style='font-size: 24px' :style="{ color: resource_data.color }">
          {{format(resource.amt.value)}}
        </b>
        {{resource_data.name}}
      </span>
    </div>
  `,
  //fixing later
  //<span v-if="resource.prod.value.gt(0)"> (+{{resource.value.prod.format()}}/s)</span>
  setup(props) {
    const resource = DATA.resources[props.name];
    const resource_data = RESOURCES[props.name];
    return {
      resource,
      resource_data,
      format
    };
  }
};
