import { formatChange, format } from "../../utils/format.js";
import Decimal, { D } from "../../utils/break_eternity.js";
import { player } from "../../player.js";
import { Resource, RESOURCES } from "../../components/resources.js";
import { Upgrade, UPGRADES, getUpgrade } from "../../components/buyables.js";
import { TABS } from "../../components/tabs.js";

import { getMiner } from "./miners.js";
import { applyScaling } from "../../utils/utils.js";

RESOURCES.greenPaper = new Resource({
  name: "Green Papers",
  color: "green",
  src: {
    parent: () => player.gp,
    id: "amt"
  }
});

UPGRADES.GreenPapers = {
  res: "greenPaper",
  player: () => player.gp.upg,
  data: [
    new Upgrade({
      name: "Miner Power",
      cost: (lvl) => {
        lvl = applyScaling(lvl, 20, 2);
        return Decimal.pow(1.3, lvl).mul(1);
      },
      eff: (lvl) => D(lvl).div(10).add(1),
      max: 50,
      desc(eff) {
        return `Miner effectiveness is increased by ${formatChange(eff)}<br>`;
      },
      group: "GreenPapers"
    }),
    new Upgrade({
      name: "Speed Mining",
      cost: (lvl) => {
        lvl = applyScaling(lvl, 20, 3);
        return Decimal.pow(1.6, lvl).mul(10);
      },
      eff: (lvl) => D(lvl).div(10).add(1),
      max: 50,
      desc(eff) {
        return `Miner speed is increased by ${formatChange(eff)}`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 0).amt.gte(1)
    }),
    new Upgrade({
      name: "Fortune Mining",
      cost: (lvl) => Decimal.pow(2, lvl).mul(100),
      eff: (lvl) => D(lvl).div(10).add(1),
      max: 20,
      desc(eff) {
        return `You get ${formatChange(eff)} more ores`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 1).amt.gte(1)
    }),
    new Upgrade({
      name: "Forgery",
      cost: () => D(1000),
      eff: () => 1,
      desc() {
        return `Unlock the Equipment.`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 2).amt.gte(1)
    }),
    new Upgrade({
      name: "Refinery",
      cost: () => D(2500),
      eff: () => 1,
      desc() {
        return `You can buy blocks with Green Papers.`;
      },
      group: "GreenPapers",
      unl: () => false
    }),
    new Upgrade({
      name: "Ore Luck",
      cost: (lvl) => Decimal.pow(3, lvl).mul(6000),
      eff: (lvl) => D(lvl).div(20).add(1),
      max: 20,
      desc(eff) {
        return `Ores spawn ${formatChange(eff)} more frequently`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 3).amt.gte(1)
    }),
    new Upgrade({
      name: "Softer Atoms",
      cost: (lvl) => Decimal.pow(5, lvl).mul(25000),
      eff: (lvl) => D(1.015).pow(lvl),
      max: 100,
      desc(eff) {
        return `Make blocks ${format(
          eff,
          2
        )}× softer, reducing block health while increasing ore gain.<br>
        Everyone deserves more progress!`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 5).amt.gte(1)
    }),
    new Upgrade({
      name: "Coordination",
      cost: () => D(65000),
      // tbd
      eff: (lvl) =>
        getMiner(0)
          .amt.add(getMiner(1).amt)
          .add(getMiner(2).amt)
          .add(getMiner(3).amt)
          .add(getMiner(4).amt)
          .add(10)
          .log10(),
      desc(eff) {
        return `<span class="tooltip detailed">
          ${format(eff)}×
          <span class="tooltiptext">log<sub>10</sub>(miner amount + 10)</span>
        </span> to miner effectiveness based on amount of miners.<br>
        Teamwork?`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 6).amt.gte(1)
    }),
    new Upgrade({
      name: "Clever Marketing",
      cost: () => D(525000),
      eff: () => RESOURCES.greenPaper.amt.add(10).log10(),
      desc(eff) {
        return `Gain <span class="tooltip detailed">
          ${format(eff)}×
          <span class="tooltiptext">log<sub>10</sub>(Green Papers + 10)</span>
        </span> more Green Papers based on your GP. This also affects buy cost.<br>`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 7).amt.gte(1)
    }),
    new Upgrade({
      name: "More Pain, Ore Gain",
      cost: () => D(50000000),
      eff: () => D(10).pow(D(player.quarry.depth).sub(75).div(50)),
      desc(eff) {
        return `Gain <span class="tooltip detailed">
          ${format(eff)}×
          <span class="tooltiptext">10<sup><frac>(depth - 75)<div>50</div></frac></span>
        </span> more ores based on depth`;
      },
      group: "GreenPapers",
      unl: () =>
        getUpgrade("GreenPapers", 8).amt.gte(1) && D(player.quarry.depth).gt(75)
    }),
    new Upgrade({
      name: "Into The Deep",
      // Free to prevent soft-locking
      cost: () => (D(player.quarry.depth).gte(100) ? D(0) : D(Infinity)),
      eff: () => 1,
      desc(eff) {
        return `Unlock Collapse.<br>
        Prestiging awaits... Rise up for more items!`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 9).amt.gte(1)
    })
  ]
};

TABS.GreenPapers = {
  disp: "Upgrades",
  component: {
    template: `
    <div>
      <div>Note: you can hover over upgrade description 
      for some upgrades to see their formulas.</div>
      <resource name="greenPaper"/><br>
      <upgrades group="GreenPapers"/>
    </div>
    `
  }
};
