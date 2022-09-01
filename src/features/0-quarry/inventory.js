import { player } from "../../player.js";
import { setupVue } from "../../setup.js";
import { ref } from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";
import { hasUpgrade } from "../../components/buyables.js";
import { TABS } from "../../components/tabs.js";
import { notify } from "../../utils/notify.js";
import { switchMap, inQuarryMap } from "./quarry.js";
import { format, formatChange } from "../../utils/format.js";

let inventoryMode = ref("usage");

export function obtainInventory(type, data) {
  let array = player.inventory[type];
  if (Object.keys(array).length >= 10) {
    notify("Max inventory reached!");
  } else {
    array.push(data);
  }
}

function deleteInventory(type, index) {
  if (inQuarryMap() && type === "map") {
    notify("Cannot delete maps while in a map.");
    return;
  }
  if (!confirm("Are you sure do you want to delete this?")) return;
  notify("Item deleted.");
  player.inventory[type].splice(index, 1);
}

function clickInventoryItem(type, index, item) {
  if (inventoryMode.value === "delete") deleteInventory(type, index);
  else if (type === "map") {
    switchMap(item);
    notify("Map loaded.");
  }
}

function switchInventoryMode() {
  inventoryMode.value = inventoryMode.value === "usage" ? "delete" : "usage";
}

TABS.Equipment = {
  unl() {
    return hasUpgrade("GreenPapers", 3);
  },
  component: {
    template: `<div>
      You can hold up to 10 unique items for each type.<br>
      <button @click="switchInventoryMode()" class="tooltip">
        Mode: {{InventoryMode === 'usage' ? "Use" : "Delete"}}
        <span class="tooltiptext">Click / Tap to {{InventoryMode.value === 'usage' ? "delete" : "use"}} an item.</span>
      </button>

      <br>
      <h2>Maps</h2>
      <Inventory type="map"/>
    </div>`,
    /*
      <h2>Pickaxes</h2>
      <Inventory group="pickaxe"/>
      <resource name="bronze"/>
      <resource name="silver"/>
      <button>Create Pickaxe with Bronze and Silver</button>

      <h2>Artifacts</h2>
      <Inventory group="artifact"/>
    */
    setup() {
      return {
        switchInventoryMode,
        InventoryMode: inventoryMode
      };
    }
  }
};

function inventoryDisplay(type, item) {
  const values = {
    text: "",
    buttonBG: "transparent"
  };
  if (type === "map") {
    values.text = "M" + format(item.depth, 0);
    values.buttonBG = "#ffff88";
  }
  return values;
}

setupVue.Inventory = {
  props: ["type"],
  template: `
  <div>
    <div v-for="[index, item] of Object.entries(data)" style="display: initial;">
      <button 
        @click="clickInventoryItem(type, index, item)"
        class="tooltip"
        style='border: 2px solid grey; height: 60px; width: 60px'
        :style="{background: inventoryDisplay(type, item).buttonBG}"
      >
        {{inventoryDisplay(type, item).text}}
        <span v-if="type == 'map'" class="tooltiptext">
          Depth: {{format(item.depth, 0)}}<br>
          Health: {{formatChange(item.health)}}<br>
          Luck: {{formatChange(item.luck)}}<br>
          Frequency: {{formatChange(item.freq)}}
        </span>
      </button>
      <br v-if="(index % 5) === 4">
    </div>
  </div>`,
  setup(props) {
    return {
      data: player.inventory[props.type],
      inventoryDisplay,
      format,
      formatChange,
      clickInventoryItem
    };
  }
};
