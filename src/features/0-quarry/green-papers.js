import { formatChange } from "../../utils/format.js";
import Decimal, { D } from "../../utils/break_eternity.js";
import { player } from "../../player.js";
import { Resource, RESOURCES } from "../../components/resources.js";
import { Upgrade, UPGRADES } from "../../components/buyables.js";
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
        return `Miner effectiveness is increased by${formatChange(eff)}<br>
        This internally increases base hit/s`;
      },
      group: "GreenPapers"
    }),
    new Upgrade({
      name: "Speed Mining",
      cost: (lvl) => Decimal.pow(1.5, lvl).mul(5),
      eff: (lvl) => D(lvl).div(10).add(1),
      max: 10,
      desc(eff) {
        return `Miner speed is increased by ${formatChange(eff)}`;
      },
      group: "GreenPapers"
    }),
    new Upgrade({
      name: "Fortune Mining",
      cost: (lvl) => Decimal.pow(2, lvl).mul(10),
      eff: (lvl) => D(lvl).div(10).add(1),
      max: 10,
      desc(eff) {
        return `You get ${formatChange(eff)} more ores`;
      },
      group: "GreenPapers"
    }),
    /*new Upgrade({
      name: "More Green Papers I", // Multiplicative
      cost: (lvl) => Decimal.pow(1.5, lvl).mul(200), // why are Green Papers upgrades limited to 1?
      eff: (lvl) => D(1.05).pow(lvl),
      desc(eff) {
        return `+${format(eff.sub(1))}% more Green Papers<br>
        Better ores = more Green Papers`;
      },
      group: "Miners"
    }),*/
    new Upgrade({
      name: "Ore Luck",
      cost: (lvl) => Decimal.pow(2, lvl).mul(100),
      eff: (lvl) => D(lvl).div(20).add(1),
      max: 20,
      desc(eff) {
        return `You get ${formatChange(eff)} more common ores`;
      },
      group: "GreenPapers"
    }),
    new Upgrade({
      name: "Softer Atoms I",
      cost: (lvl) => Decimal.pow(2.25, lvl).mul(200),
      eff: (lvl) => D(1.015).pow(lvl),
      max: 100,
      desc(eff) {
        return `Block health is reduced by ${formatChange(eff)}<br>
        Everyone deserves more progress!`;
      },
      group: "GreenPapers"
    }),
    new Upgrade({
      name: "Refinery",
      cost: (lvl) => D(100),
      eff: (lvl) => 1,
      desc(eff) {
        return `You can buy blocks with Green Papers.`;
      },
      group: "GreenPapers"
    }),
    new Upgrade({
      name: "Synergy I",
      cost: (lvl) => D(500),
      // tbd
      eff: (lvl) => 1,
      desc(eff) {
        return `+${formatChange(eff)} to miner speed based on amount of miners.`
      },
      group: "GreenPapers"
    })
  ]
};

TABS.GreenPapers = {
  disp: "Upgrades",
  parent: "Quarry",
  component: {
    template: `
      <resource name="greenPaper"/><br>
      <upgrades group="GreenPapers"/>
    `
  }
};
