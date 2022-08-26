import { createApp } from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";
import { miners } from "./features/miners.js";
import { RESOURCES } from "./features/resources.js";
import { runGame } from "./features/player.js";
import { format, trollFormat } from "./utils/format.js";

// VERY MUCH FOR TESTING
const TABS = {
  Main: ["Miners", "What"],
  What: ["Miners"],
  Miners: []
};

createApp()
  .component("main-app", {
    // change it when you're done
    template: `
      <tab-internal :tab='"Main"' />
    `,
    mounted() {
      runGame();
    },
    setup() {
      return {
        TABS
      };
    }
  })
  .component("tab-internal", {
    props: ["tabs"],
    data() {
      return {
        tabClicked: undefined
      };
    },
    // this won't show the content itself :(
    template: `
      <div>Testing...</div>
      <span v-if="tabs.length > 0">
        <span v-if="tabs.length > 1" v-for="subtab of tabs">
          <button @click="tabClicked = subtab" :tabrole="subtab.toLowerCase()">{{subtab}}</button>
        </span><br>
        <span v-for="subtab of tabs">
          <tab-internal v-if="tabClicked === subtab" :tab="tabClicked" />
        </span>
      </span> 
    `,
    watch: {
      tabs: {
        immediate: true,
        handler(newVal) {
          // bruh lmao
          this.tabClicked = TABS[this.tab][0];
        }
      }
    },
    components: {
      Main: {
        template: `<resource name="Coins" />`
      },
      Miners: {
        template: `
        <table>
          <tbody>
            <building v-for="(_,key) in miners" :id="key" />
          </tbody>
        </table>`,
        setup() {
          return {
            miners
          };
        }
      },
      What: {
        template: `what.`
      }
    },
    setup(props) {
      const tabs = TABS[props.tab];
      return {
        tabs
      };
    }
  })
  .component("resource", {
    // id is a built-in html prop
    // don't use it
    props: ["name"],
    template: `
      <span><span style='font-size: 18px'>{{format(resource.amount)}}</span> {{resource.name}}</span>
      <span v-if="resource.production.gt(0)" style='font-size: 8px'>(+{{format(resource.production)/s}})</span>
    `,
    setup(props) {
      const resource = RESOURCES[props.name];
      return {
        resource,
        format
      };
    }
  })
  .component("building", {
    props: ["id"],
    template: `
      <tr v-if="build.unl.value">
        <td style='width: 240px'><b>{{build.name}}</b>:</td>
        <td>{{build.amt}}</td>
        <td style='font-size: 8px'>({{build.desc.value}})</td>
        <td><button @click="build.buy()">Cost: {{trollFormat(build.cost.value)}}</button></td>
      </tr>
    `,
    setup(props) {
      const build = miners[props.id];
      return {
        build,
        format
      };
    }
  })
  .mount("#app");
