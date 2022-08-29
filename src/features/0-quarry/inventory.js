import { TABS } from "../../components/tabs.js";
import { setupVue } from "../../setup.js";
//TODO: Implement pickaxes, equipment

TABS.Equipment = {
  parent: "Quarry",
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

      <b>Maps</b><br>
      <Inventory group="map"/>
      <b>Pickaxes</b><br>
      <Inventory group="pickaxe"/>
      <b>Artifacts</b><br>
      <Inventory group="artifact"/>
    </div>
    `
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
