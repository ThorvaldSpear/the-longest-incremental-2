import { setupVue } from "../../setup.js";

import { player } from "../../player.js";
import { DATA, TICK_DATA } from "../../tmp.js";

import {
  Buyable,
  BUYABLES,
  getBuyable,
  getBuyableEff,
  getUpgradeEff,
  hasUpgrade
} from "../../components/buyables.js";
import {
  createChainedMulti,
  createMultiplicativeMulti,
  createUpgradeMulti
} from "../../components/gainMulti.js";
import { Resource, RESOURCES } from "../../components/resources.js";
import { TABS } from "../../components/tabs.js";

import { format, formatTime } from "../../utils/format.js";
import Decimal, { D } from "../../utils/break_eternity.js";
import { random } from "../../utils/utils.js";

import { mineBlock } from "./blocks.js";
import { isBlockExposed } from "./quarry.js";

//Make sure to add assignation too
class Miner extends Buyable {
  constructor(obj) {
    super(obj);
    this.x = obj.x;

    this.dmgMultiplier = createChainedMulti(
      (amt) => obj.eff(amt ?? this.amt, this.x),
      createMultiplicativeMulti(
        createUpgradeMulti({
          group: "GreenPapers",
          id: 0,
          type: "multiply"
        })
      ),
      createMultiplicativeMulti(
        createUpgradeMulti({
          group: "GreenPapers",
          id: 7,
          type: "multiply"
        })
      )
    );

    this.speedMultiplier = createChainedMulti(
      () => this.speed,
      createMultiplicativeMulti({
        toMultiply: () => getUpgradeEff("GreenPapers", 1),
        enabled: () => hasUpgrade("GreenPapers", 1),
        name: "Speed Mining"
      })
    );
    this._eff = obj.eff;
    this.eff = (amt) => {
      return this.dmgMultiplier.value(amt);
    };

    this.select =
      obj.select ??
      ((x, y, block) => {
        return isBlockExposed(x, y);
      });

    this.progress = Decimal.dZero;
    this.speed = obj.speed || 1;
    this.diffDesc = "damage/hit";
  }
  hit(diff) {
    if (Decimal.eq(this.player[this.name.toLowerCase()] ?? 0, 0)) return;

    const speed = this.speedMultiplier.value();
    this.progress = this.progress.plus(Decimal.mul(speed, diff));
    const hits = this.progress.floor();
    if (hits.lt(1)) return;
    this.progress = this.progress.sub(hits);

    player.stats.hits = hits.add(player.stats.hits);

    let pick;
    const choice = [];
    for (const y of player.quarry.map.keys())
      for (const x of player.quarry.map[y].keys()) {
        const block = player.quarry.map[y][x];
        if (Decimal.gt(block.health, 0) && this.select(x, y, block))
          choice.push([x, y]);
      }
    if (!choice.length) return;
    pick = random(choice);

    mineBlock(pick[0], pick[1], getMinerEff(this.x).mul(hits));
  }
}

setupVue.miner = {
  props: ["value"],
  template: `
    <div class="buyable" v-if="key_data.unl()">
      <div :role="key_data.name.toLowerCase()">
        <b>({{format(key.amt.value, 0)}}×) {{key_data.name}}</b><br>
        <span>
          <gain-multi :multi="key_data.dmgMultiplier">
            {{format(key.eff.value)}} damage/hit
          </gain-multi> × 
          <gain-multi :multi="key_data.speedMultiplier">
            {{format(
              key_data.speedMultiplier.value()
            )}} hits/sec
          </gain-multi><br>{{key_data.desc(key.eff.value)}}
        </span>
      </div>
      <div>
        <button @click="key_data.buy()" 
        :class="{
          canbuy: key_data.canBuy(), 
          cannotbuy: !key_data.canBuy()
        }">
          <b>{{key_group.buyPhrase ?? "Buy"}} +1</b><br>
          {{
            (Decimal.gt(key.levelDiff.value, 0) ? "+" : "")
             + format(key.levelDiff.value)
          }} {{key_data.diffDesc}}<br>
          {{format(key.cost.value)}} {{key_data.res.name}}
        </button>
      </div>
    </div>
  `,
  setup(props) {
    const key = DATA.buyables.Miners[props.value];
    const key_group = BUYABLES.Miners;
    const key_data = key_group.data[props.value];
    return {
      key,
      key_group,
      key_data,
      format,
      Decimal
    };
  }
};

export function getMiner(x) {
  return getBuyable("Miners", x);
}

export function getMinerEff(x) {
  return getBuyableEff("Miners", x);
}

//Insert new content
TICK_DATA.miners = function (diff) {
  player.miners.manualCooldown = Math.max(
    player.miners.manualCooldown - diff,
    0
  );
};

RESOURCES.mana = new Resource({
  name: "Mana",
  color: "blue",
  src: {
    parent: () => player.miners,
    id: "mana"
  },
  prodFunc() {
    return D(1e3).pow(D(player.quarry.depth).div(50)).sub(1).div(100);
  },
  based: "Quarry Depth"
});

BUYABLES.Miners = {
  res: "mana",
  player: () => player.miners.amt,
  data: [
    // @type {Array<Buyable>}
    new Miner({
      name: "Novice Miner",
      cost: (lvl) => (D(lvl).eq(0) ? D(0) : lvl.pow(4).add(9)),
      eff: (lvl) => D(lvl),
      desc(eff) {
        return `to 1 exposed block`;
      },
      group: "Miners",
      x: 0
    }),
    new Miner({
      name: "Stone Miner",
      cost: (lvl) => lvl.add(1).pow(4).add(9),
      eff: (lvl) => D(lvl).mul(2),
      desc(eff) {
        return `to 1 exposed non-ore block`;
      },
      select(x, y, block) {
        return isBlockExposed(x, y) && !block.ore;
      },
      unl: () => getMiner(0).amt.gte(1),
      group: "Miners",
      speed: 0.65,
      x: 1
    }),
    new Miner({
      name: "Veining Miner",
      cost: (lvl) => lvl.add(1).pow(4).mul(2).add(98),
      eff: (lvl) => D(lvl).mul(2),
      desc(eff) {
        return `to 1 block on the highest layer`;
      },
      select(x, y, block) {
        return y === 0 || y === "0"; // eslint-disable eqeqeq
      },
      unl: () => getMiner(1).amt.gte(1),
      group: "Miners",
      speed: 0.8,
      x: 2
    }),
    new Miner({
      name: "Efficient Miner",
      cost: (lvl) => lvl.add(1).pow(4).mul(4).add(996),
      eff: (lvl) => D(lvl),
      desc(eff) {
        return `to 1 exposed ore block`;
      },
      select(x, y, block) {
        return isBlockExposed(x, y) && block.ore;
      },
      unl: () => getMiner(2).amt.gte(1),
      group: "Miners",
      speed: 3,
      x: 3
    }),
    new Miner({
      name: "Ranged Miner",
      cost: (lvl) => lvl.add(1).pow(4).mul(8).add(9992),
      eff: (lvl) => D(lvl).mul(5),
      desc(eff) {
        return `to 1 exposed block + 1/2 damage to 4 adjacent blocks`;
      },
      unl: () => getMiner(3).amt.gte(1),
      group: "Miners",
      speed: 0.125,
      x: 4
    })
  ]
};

TABS.Miners = {
  component: {
    template: ``
  }
};

setupVue.miners = {
  template: `
  <div>
    <resource name="mana" /><br>
    <div class="buyables" align=center>
      <miner v-for="(_, key) in BUYABLES.Miners.data" :value="key" />
    </div><br>
  </div>
  `,
  setup() {
    return {
      BUYABLES,
      player,
      formatTime
    };
  }
};
