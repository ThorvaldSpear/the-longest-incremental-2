// import vue
import { createApp } from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";
import { setupVue } from "./setup.js";

// what the heck  is this now
import { loadGame } from "./player.js";

import "./features/news-ticker.js";
import "./features/import-layer.js";
import { random } from "./utils/utils.js";

/* --- CODE START --- */
export const app = createApp()
  .component("main-app", {
    template: `
      <version />
      <notifications />
      <tab tab="Layers" />
    `
  })
  .component("grid", {
    props: ["width", "height", "type"],
    template: `
      <table style="border-collapse: collapse;width:auto;">
        <tr v-for="y in Number(height)">
          <td v-for="x in Number(width)" style="padding: 0">
            <component :is="type" :x="x-1" :y="y-1" :width="width" :height="height" />
          </td>
        </tr>
      </table>
    `
  });

for (const [index, key] of Object.entries(setupVue)) app.component(index, key);

// Random title better than news ticker
const titles = [
  "Refactor I",
  "The Deepest Shaft",
  "The Incremental of Black Company"
];
document.title = "The Longest Incremental²: " + random(titles);

loadGame();
