import { TABS } from "./components/tabs.js";
import { player } from "./player.js";

export const isDev = false;
export function loadDev() {
  window.TABS = TABS;
  window.player = player;
  TABS.Experimental = {
    parent: "Menu",
    component: {
      template: `<div>testing testing 1 2 3</div>`
    }
  };
}
