import { TABS } from "../../components/tabs.js";
import { setupVue } from "../../setup.js";

import { hasUpgrade } from "../../components/buyables.js";

TABS.Equipment = {
  parent: "Quarry",
  unl() {
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
      <h2>Maps</h2>
      <Inventory group="map"/>
      <h2>Pickaxes</h2>
      <Inventory group="pickaxe"/>
      <resource name="bronze"/>
      <resource name="silver"/>
      <button>Create Pickaxe with Bronze and Silver</button>
      <h2>Artifacts</h2>
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
    <h3>5/5</h3><br>
    <div>
      <button style='border: 2px solid grey; background: transparent; height: 30px; width: 30px'></button>
      <button style='border: 2px solid grey; background: transparent; height: 30px; width: 30px'></button>
      <button style='border: 2px solid grey; background: transparent; height: 30px; width: 30px'></button>
      <button style='border: 2px solid grey; background: transparent; height: 30px; width: 30px'></button>
      <button style='border: 2px solid grey; background: transparent; height: 30px; width: 30px'></button>
    </div>
  `
};
