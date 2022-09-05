import Decimal, { D } from "../utils/break_eternity.js";
import { format } from "../utils/format.js";
import { getUpgradeEff, hasUpgrade, UPGRADES } from "./buyables.js";
import { setupVue } from "../setup.js";
import { createLazyProxy } from "../utils/utils.js";

/**
Returns a multi instance.
 */

// helper garbage for creating + displaying multipliers
function createBaseMulti(obj) {
  return obj;
}

export function createUpgradeMulti({ group, id, type, change }) {
  const realChange = change ?? ((x) => x);
  return createLazyProxy(() => ({
    [type === "add" ? "toAdd" : "toMultiply"]: () =>
      realChange(getUpgradeEff(group, id)),
    enabled: () => hasUpgrade(group, id),
    name: () => UPGRADES[group].data[id].name
  }));
}
export function createAdditiveMulti({ toAdd, enabled, name }) {
  return createBaseMulti({
    apply: (gain) => Decimal.add(gain, toAdd()),
    enabled,
    description: () => {
      let diff = D(toAdd());
      return (diff.gt(0) ? "+" : "") + format(diff);
    },
    name
  });
}

export function createMultiplicativeMulti({ toMultiply, enabled, name }) {
  return createBaseMulti({
    apply: (gain) => Decimal.mul(gain, toMultiply()),
    enabled,
    description: () => {
      let diff = D(toMultiply());
      return diff.abs().gt(1) ? `×${format(diff)}` : `÷${format(diff.recip())}`;
    },
    name
  });
}

export function createChainedMulti(base, ...modifiers) {
  return {
    value(...args) {
      return modifiers
        .filter((m) => m.enabled() !== false)
        .reduce((gain, modifier) => {
          return modifier.apply(gain, ...args);
        }, this.base(...args) ?? 1);
    },
    enabled: () => !modifiers.every((m) => m.enabled() === false),
    multi: modifiers,
    base
  };
}

setupVue["gain-multi"] = {
  props: ["multi", "props"],
  template: `
  <span class="tooltip detailed">
    <slot></slot>
    <span class="tooltiptext">
    <b>Modifiers:</b><br>
    <table>
      <tr>
        <td>
          Base:
        </td>
        <td>
          {{format(multi.base())}}
        </td>
      </tr>
      <template v-for="disp of multi.multi">
        <tr v-if="disp.enabled()">
          <td>
            {{typeof disp.name === 'function' ? disp.name() : disp.name}}:
          </td>
          <td>
            {{disp.description()}}
          </td>
        </tr>
      </template>
      <tr>
        <td>
          Total:
        </td>
        <td>
          {{format(multi.value())}}
        </td>
      </tr>
    </table>
    </span>
  </span>
 `,
  setup() {
    return {
      format
    };
  }
};
