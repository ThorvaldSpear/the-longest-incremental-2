import { app } from "../index.js";
import { player } from "../player.js";
import { save, exportSave, importSave, hardReset } from "../utils/saveload.js";

export const TABS = (window.TABS = {
  Layers: {
    subtabs: ["Quarry", /*"Statistics",*/ "Options"]
  },
  Options: {
    subtabs: ["OptionsMain", "About"]
  },
  OptionsMain: {
    disp: "Options",
    component: {
      template: `
      <div>
        <h2>Save</h2>
        <button @click="save(true)">Save</button>
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
          Offline: {{player.options.off ? "ON" : "OFF" }}</button
        ><br />

        <h2>Discord</h2>
        <a href="https://discord.gg/fcEXYjPQ43" target="_blank">Discord</a>
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
        <h3>β0.0</h3>
        Released.
      </div>
      `
    }
  },

  Quarry: {
    /*component: {
      template: `<button>Collapse!</button>`
    }*/
  }
});

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
      <div class='tab_navigator' v-if="tabs.subtabs !== undefined && tabs.subtabs.length > 1" :role="tab.toLowerCase()">
        <br>
        <span v-for="subtab of tabs.subtabs">
          <button 
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
    setup(props) {
      return {
        TABS
      };
    },
    components: extraComps
  });
}

export function resetTabs() {}
