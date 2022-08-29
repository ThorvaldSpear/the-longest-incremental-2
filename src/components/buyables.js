import { setupVue } from "../setup.js";
import { DATA } from "../tmp.js";
import { RESOURCES } from "./resources.js";
import Decimal, { D } from "../utils/break_eternity.js";
import { format, formatChange } from "../utils/format.js";

/**
 * The Buyable class for creating buyables.
 */
export class Buyable {
  constructor({ name, group, unl, max, cost, eff, defer, desc, diffDesc }) {
    this.name = name;
    this.group = group;
    this.unl = unl ?? (() => true);
    this.max = max ?? Infinity;
    this.cost = cost;
    this.eff = eff;
    this.defer = defer ?? D(0);
    this.desc = desc;
    this.diffDesc = diffDesc ?? "to effect";
  }
  get levelDiff() {
    return this.eff(this.amt.add(1)).sub(this.eff(this.amt));
  }

  get groupData() {
    return (this.upg ? UPGRADES : BUYABLES)[this.group];
  }
  get res() {
    return RESOURCES[this.groupData.res];
  }
  get player() {
    return this.groupData.player();
  }
  get amt() {
    return D(this.player[this.name.toLowerCase()] ?? 0);
  }
  get maxed() {
    return this.amt.gte(this.max);
  }

  canBuy() {
    return this.res.amt.gte(this.cost(this.amt)) && !this.maxed;
  }
  buy() {
    if (!this.unl()) return;
    if (!this.canBuy()) return;
    this.res.sub(this.cost(this.amt));
    this.player[this.name.toLowerCase()] = this.amt.add(1).min(this.max);
  }
}
export const BUYABLES = {};
export function getBuyable(group, x) {
  return BUYABLES[group].data[x];
}
export function getBuyableEff(group, x) {
  return DATA.setup
    ? DATA.buyables[group][x].eff.value
    : getBuyable(group, x).defer;
}
setupVue.buyable = {
  props: ["group", "value"],
  template: `
    <div class="buyable" v-if="key_data.unl()">
      <div :role="key_data.name.toLowerCase()">
        <b>({{format(key.amt.value, 0)}}x) {{key_data.name}}</b><br>
        <span v-html="key_data.desc(key.eff.value)" />
      </div>
      <div>
        <button @click="key_data.buy()" 
        :class="{
          canbuy: key_data.canBuy(), 
          cannotbuy: !key_data.canBuy()
        }">
          <b>{{key_group.buyPhrase ?? "Buy"}} +1</b><br>
          +{{
            key_data.desc(key.eff.value).includes("%") ? 
            formatChange(key.levelDiff.value.add(1)) 
            : format(key.levelDiff.value)
          }} {{key_data.diffDesc}}<br>
          {{format(key.cost.value)}} {{key_data.res.name}}
        </button>
      </div>
    </div>
  `,
  setup(props) {
    const key = DATA.buyables[props.group][props.value];
    const key_group = BUYABLES[props.group];
    const key_data = key_group.data[props.value];
    return {
      key,
      key_group,
      key_data,
      format,
      formatChange
    };
  }
};
setupVue.buyables = {
  props: ["group"],
  template: `
    <div class="buyables" align=center>
      <buyable v-for="(_,key) in BUYABLES[group].data" :group="group" :value="key" />
    </div>
  `,
  setup() {
    return { BUYABLES };
  }
};

/**
 * Upgrades work the same as Buyables
 */
export class Upgrade extends Buyable {
  constructor(d) {
    super(d);
    this.upg = true;
    this.max = d.max ?? 1;
  }
}
export const UPGRADES = {};
export function getUpgrade(group, x) {
  return UPGRADES[group]?.data[x];
}
export function getUpgradeEff(group, x) {
  return DATA.setup
    ? DATA.upgrades[group][x].eff.value
    : getUpgrade(group, x).defer;
}
export function hasUpgrade(group, x) {
  return DATA.upgrades[group][x].amt.value.gt(0);
}

setupVue.upgrade = {
  props: ["group", "value"],
  template: `
    <div class="buyable" v-if="key_data.unl()">
      <div :role="key_data.name.toLowerCase()">
        <b>
          ({{format(key.amt.value, 0)}} / {{format(key_data.max, 0)}}) {{key_data.name}}
        </b><br>
        <span v-html="key_data.desc(key.eff.value)" />
      </div>
      <div>
        <button @click="key_data.buy()" 
        :class="{
          canbuy: key_data.canBuy(), 
          cannotbuy: !key_data.canBuy()
        }">
          <span v-if="!key_data.maxed">
            <b>{{key_group.buyPhrase ?? "Buy"}} {{Decimal.eq(key_data.max, 1) ? "" : "+1"}}</b><br>
            <span v-if="Decimal.gt(key_data.max, 1)">
              +{{
                key_data.desc(key.eff.value).includes("%") 
                ? formatChange(key.levelDiff.value.add(1)) 
                : format(key.levelDiff.value)
              }} {{key_data.diffDesc}}<br>
            </span>
            {{format(key.cost.value)}} {{key_data.res.name}}
          </span>
          <span v-else>
            <b>{{Decimal.eq(key_data.max, 1) ? "Bought" : "Maxed"}}</b>
          </span>
        </button>
      </div>
    </div>
  `,
  setup(props) {
    const key = DATA.upgrades[props.group][props.value];
    const key_group = UPGRADES[props.group];
    const key_data = key_group.data[props.value];
    return {
      key,
      key_group,
      key_data,
      format,
      formatChange,
      Decimal
    };
  }
};
setupVue.upgrades = {
  props: ["group"],
  template: `
    <div class="buyables" align=center>
      <upgrade v-for="(_,key) in UPGRADES[group].data" :group=group :value="key" />
    </div>
  `,
  setup() {
    return { UPGRADES };
  }
};
