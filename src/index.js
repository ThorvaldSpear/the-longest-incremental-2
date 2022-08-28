// import vue
import { createApp } from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";
import { setupVue } from "./setup.js";

// what the heck  is this now
import { loadGame, interval } from "./player.js";

// import "./utils/gradient.js";
import { DATA } from "./tmp.js";
import { notify } from "./utils/notify.js";

import "./features/import-layer.js";
/* --- CODE START --- */
export const app = createApp({
  setup() {
    return {
      DATA
    };
  }
})
  .component("main-app", {
    template: `
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

window.onerror = (event, source, lineno, colno, error) => {
  clearInterval(interval);
  // \n won't work
  console.error(error.toString());
  notify(
    `Your game has run into a error: ${error.toString()}. Please check the console...`,
    { dismissable: false }
  );
};

loadGame();
