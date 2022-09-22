import { hasUpgrade } from "./buyables.js";
import { player } from "../player.js";

const icons = [
  ["images/icons/icon-quarry.png", () => true],
  ["images/icons/icon-equipment.png", () => hasUpgrade("GreenPapers", 3)]
];

function updateIcon() {
  let element = document.getElementById("icon");
  if (player.options.icons) {
    for (let i = icons.length - 1; i >= 0; i--) {
      if (icons[i][1]()) {
        element.href = icons[i][0];
        break;
      }
    }
  } else {
    element.href = icons[0][0];
  }
}

setInterval(updateIcon, 500);
