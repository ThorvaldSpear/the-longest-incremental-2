import { TABS } from "../../components/tabs.js";
import { setupVue } from "../../setup.js";

import { hasUpgrade } from "../../components/buyables.js";

TABS.Equipment = {
  parent: "Quarry",
  requirements() {
    return hasUpgrade("GreenPapers", 3);
  },
  // aarex list element does not exist
  // it exists for cosmetic decorations.
  // ???
  component: {
    template: `
    <div>
      <div class="buyables">
        <div class="buyable">
          <div><b>Novice Miner</b></div>
          <div>
            Equipping...<br>
            <ul>
              <li>Starter Pickaxe</li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
      </div>

      You can hold up to 5 unique items for each type.<br>
      <b>Maps</b><br>
      <Inventory group="map"/>
      <b>Pickaxes</b><br>
      <button v-if="">Create Pickaxe</button>
      <Inventory group="pickaxe"/>
      <b>Artifacts</b><br>
      <Inventory group="artifact"/>
    </div>
    `
  },
  setup() {
    return {
      hasUpgrade
    };
  }
};

setupVue.Inventory = {
  props: ["group"],
  template: `
    <b>5/5</b><br>
    <div style='border: 2px solid grey; height: 30px; width: 30px'></div>
    <div style='border: 2px solid grey; height: 30px; width: 30px'></div>
    <div style='border: 2px solid grey; height: 30px; width: 30px'></div>
    <div style='border: 2px solid grey; height: 30px; width: 30px'></div>
    <div style='border: 2px solid grey; height: 30px; width: 30px'></div>
  `
};
