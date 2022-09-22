import { setupVue } from "../setup.js";
import { D } from "../utils/break_eternity.js";
import { format } from "../utils/format.js";

export const GAIN_MULTS = {};

export function calcMulti(id) {
  let ret = D(1);
  for (let mult of GAIN_MULTS[id]) ret = ret.mul(mult.eff());
  return ret;
}

export function multiEnabled(id, num) {
  return GAIN_MULTS[id][num].eff().neq(1);
}

export function calcBaseMulti(id) {
  return GAIN_MULTS[id][0].eff();
}

// NEW CONTENT
setupVue.gainMult = {
  props: ["type"],
  template: `
    <span class="tooltip detailed">
      <slot></slot>
      <span class="tooltiptext">
        <b>Modifiers:</b><br>
        <table>
          <template v-for="[num, multi] of Object.entries(data)">
            <tr v-if="multiEnabled(type, num)">
              <td>
                {{multi.name}}:
              </td>
              <td>
                {{format(multi.eff())}}x
              </td>
            </tr>
          </template>
          <tr>
            <td>
              Total:
            </td>
            <td>
              {{format(calcMulti(type))}}
            </td>
          </tr>
        </table>
      </span>
    </span>
  `,
  setup() {
    return {
      data: GAIN_MULTS.type,

      calcMulti,
      multiEnabled,
      format
    };
  }
};

GAIN_MULTS.example = [
  {
    name: "Base",
    eff: () => D(1)
  },
  {
    name: "Doubler!",
    eff: () => D(2)
  }
];
