import { app } from "../index.js";
import { player } from "../player.js";
import { save, exportSave, importSave, hardReset } from "../utils/saveload.js";
import { isDev } from "../dev.js";

export const TABS = {
  Layers: {
    subtabs: ["Quarry", "Menu"]
  },
  Menu: {
    component: {
      template: `<div>Note: Hovering over some numbers allows you to see their formulas.</div>`
    },
    subtabs: [
      "Options",
      "Stats",
      "Story",
      "Achievements",
      "About",
      ...(isDev ? ["Experimental"] : [])
    ]
  },
  Options: {
    component: {
      template: `
        <div>
          <h2>Save</h2>
          <button @click="save(true)">Save</button>
          <button @click="">Load (not implemented yet)</button>
          <button @click="exportSave()">Export</button>
          <button @click="">Download (not implemented yet)</button>
          <button @click="importSave()">Import</button>
          <button @click="$refs.importFile.click()">
            Import File</button
          ><input
            type="file"
            style="display: none"
            ref="importFile"
            accept=".txt"
          />
          <button id="hardreset" @click="hardReset()">HARD RESET</button>
          <br />
          <button
            id="offline"
            @click="player.options.off = !player.options.off"
          >
            Offline Progression: {{player.options.off ? "ON" : "OFF" }}</button
          ><br />

          <h2>Misc</h2>
          <button @click="player.options.news=!player.options.news">
            News ticker: {{player.options.news ? "ON" : "OFF"}}
          </button>
          <button @click="player.options.icons=!player.options.icons">
            Icons: {{player.options.icons ? "Based off progress" : "Dirt"}}
          </button>

          <h2>Discord</h2>
          <a href="https://discord.gg/fcEXYjPQ43" target="_blank"><button>Discord</button></a>
        </div>
      `,
      setup() {
        return {
          save,
          importSave,
          exportSave,
          hardReset,
          player
        };
      }
    }
  },
  About: {
    component: {
      template: `
      <div>
        <h1>The Longest Incremental<sup>2</sup></h1>
        The official sequel to 
        <a href="https://unsoftcapped3.github.io/the-longest-incremental/">
          The Longest Incremental
        </a>

        <h2>Credits</h2>
        Hosted by meta.

        <h2>Changelog</h2>
        <h3>α0.0</h3>
        Released.
      </div>
      `
    }
  }
};

if (isDev) {
  window.TABS = TABS;
  TABS.Experimental = {
    template: `testing testing 1 2 3`
  };
}

export function initTabs() {
  const extraComps = {};
  for (const [index, key] of Object.entries(TABS)) {
    if (key.disp === undefined) key.disp = index;
    if (key.unl === undefined) key.unl = () => true;

    if (key.parent) {
      const push_subtabs = TABS[key.parent]?.subtabs ?? [];
      push_subtabs.push(index);
      TABS[key.parent].subtabs = push_subtabs;
    }
    if (key.component) extraComps[index] = key.component;
  }

  app.component("tab", {
    data() {
      return {
        tabClicked: undefined
      };
    },
    props: ["tab"],
    template: `
      <component class="tab" :is="tab" />
      <div class='tab_navigator' 
      v-if="tabs.subtabs !== undefined && tabs.subtabs.length > 1" :role="tab.toLowerCase()">
        <br>
        <span v-for="subtab of tabs.subtabs" :key="subtab">
          <button v-if="TABS[subtab].unl()"
            :key="subtab"
            :role="subtab.toLowerCase()"
            @click="tabClicked = subtab"
          >
            {{TABS[subtab]?.disp ?? subtab}}
          </button>
        </span>
      </div>
      <br>
      <tab v-if="tabs.subtabs !== undefined" :tab="tabClicked" />
    `,
    watch: {
      tab: {
        immediate: true,
        handler(newVal) {
          this.tabClicked = TABS?.[this.tab]?.subtabs?.[0];
        }
      }
    },
    computed: {
      tabs() {
        return TABS[this.tab] ?? {};
      }
    },
    setup() {
      return {
        TABS
      };
    },
    components: extraComps
  });
}

export function resetTabs() {}
