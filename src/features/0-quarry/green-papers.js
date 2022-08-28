import { formatChange } from "../../utils/format.js";
import Decimal, { D } from "../../utils/break_eternity.js";
import { player } from "../../player.js";
import { Resource, RESOURCES } from "../../components/resources.js";
import { Upgrade, UPGRADES, getUpgrade } from "../../components/buyables.js";
import { TABS } from "../../components/tabs.js";

RESOURCES.greenPaper = new Resource({
  name: "Green Papers",
  color: "lime",
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
      cost: (lvl) => Decimal.pow(1.5, lvl).mul(2),
      eff: (lvl) => D(lvl).div(5).add(1),
      max: 5,
      desc(eff) {
        return `Miner effectiveness is increased by ${formatChange(eff)}<br>`;
      },
      group: "GreenPapers"
    }),
    new Upgrade({
      name: "Speed Mining",
      cost: (lvl) => Decimal.pow(1.25, lvl).mul(3),
      eff: (lvl) => D(lvl).div(5).add(1),
      max: 5,
      desc(eff) {
        return `Miner speed is increased by ${formatChange(eff)}`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 0).amt.gte(1)
    }),
    new Upgrade({
      name: "Fortune Mining",
      cost: (lvl) => Decimal.pow(1.25, lvl).mul(5),
      eff: (lvl) => D(lvl).div(10).add(1),
      max: 10,
      desc(eff) {
        return `You get ${formatChange(eff)} more ores`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 1).amt.gte(1)
    }),
    new Upgrade({
      name: "Anviling",
      cost: (lvl) => D(10),
      eff: (lvl) => 1,
      desc(eff) {
        return `You can create better Pickaxes with Bronze and Silver.`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 2).amt.gte(1)
    }),
    new Upgrade({
      name: "Refinery",
      cost: (lvl) => D(10),
      eff: (lvl) => 1,
      desc(eff) {
        return `You can buy blocks with Green Papers.`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 3).amt.gte(1)
    }),
    new Upgrade({
      name: "Ore Luck",
      cost: (lvl) => Decimal.pow(1.5, lvl).mul(20),
      eff: (lvl) => D(lvl).div(20).add(1),
      max: 20,
      desc(eff) {
        return `You get ${formatChange(eff)} more common ores`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 4).amt.gte(1)
    }),
    new Upgrade({
      name: "Softer Atoms",
      cost: (lvl) => Decimal.pow(2.25, lvl).mul(200),
      eff: (lvl) => D(1.015).pow(lvl),
      max: 100,
      desc(eff) {
        return `Block health is reduced by ${formatChange(eff)}<br>
        Everyone deserves more progress!`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 5).amt.gte(1)
    }),
    new Upgrade({
      name: "Coordination",
      cost: (lvl) => D(500),
      // tbd
      eff: (lvl) => 1,
      desc(eff) {
        return `+${formatChange(
          eff
        )} to miner effectiveness based on amount of miners.<br>
        Teamwork?`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 6).amt.gte(1)
    }),
    new Upgrade({
      name: "SSH Hashing",
      cost: () => D(225),
      eff: () => 1,
      desc(eff) {
        return `Gain ${formatChange(
          eff
        )} more Green Papers based on your GP.<br>
        #SSH Hashing (^-^)`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 7).amt.gte(1)
    }),
    new Upgrade({
      name: "Into The Deep",
      cost: () => D(1000),
      eff: () => 1,
      desc(eff) {
        return `Unlock Collapse reset.<br>
        Requires 100 Depth!`;
      },
      group: "GreenPapers",
      unl: () => getUpgrade("GreenPapers", 8).amt.gte(1)
    })
  ]
};

TABS.GreenPapers = {
  disp: "Upgrades",
  parent: "Quarry",
  component: {
    template: `
    <div>
      <resource name="greenPaper"/><br>
      <upgrades group="GreenPapers"/>
    </div>
    `
  }
};
