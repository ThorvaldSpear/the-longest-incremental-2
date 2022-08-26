import { createApp } from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";
import { runGame } from "./features/player.js";
import { BUYABLES } from "./features/miners.js";
import { RESOURCES } from "./features/resources.js";
import { format } from "./utils/format.js";
import { load } from "./utils/saveload.js";
import { notifications, removeNotify } from "./features/notify.js";

// VERY MUCH FOR TESTING
const TABS = {
  Main: ["Miners", "Pickaxes"],
  Miners: [],
  Pickaxes: []
};
createApp()
  .component("main-app", {
    // change it when you're done
    template: `
      <notifications />
      <tab tab="Main" />
    `,
    mounted() {
      load();
      runGame();
    },
    setup() {
      return {
        TABS
      };
    }
  })
  .component("notifications", {
    data() {
      return {
        int: undefined
      };
    },
    template: `
      <div id="notifyarea">
        <div
          v-for="(notify, i) in notif"
          class="notification"
          :key="notify.time"
          @click="removeNotify(i)"
        >
          {{notify.message}}
        </div>
      </div>
    `,
    mounted() {
      this.int = setInterval(() => {
        for (const [i, notif] of this.notifications.entries()) {
          if ((Date.now() - notif.time) / 1000 > 15) {
            this.removeNotify(i);
          }
        }
      }, 100);
    },
    beforeUnmount() {
      clearInterval(this.int);
    },
    computed: {
      notif() {
        return this.notifications.slice().reverse();
      }
    },
    setup() {
      return {
        notifications,
        removeNotify
      };
    }
  })
  .component("tab", {
    props: ["tab"],
    data() {
      return {
        tabClicked: undefined
      };
    },
    template: `
      <div class="tab">
        <component :is="tab"/>
      </div>
      <div v-if="tabs.length > 0">
        <div class='tab_navigator' v-if="tabs.length > 1">
          <button 
            :key="subtab" 
            v-for="subtab of tabs" 
            @click="tabClicked = subtab" 
            :tabrole="subtab.toLowerCase()"
          >{{subtab}}</button>
        </div>
        <br>
        <div v-for="subtab of tabs">
          <tab :key="subtab" v-if="tabClicked === subtab" :tab="tabClicked" />
        </div>
      </div>
    `,
    watch: {
      tabs: {
        immediate: true,
        handler() {
          // bruh lmao
          this.tabClicked = TABS[this.tab][0];
        }
      }
    },
    components: {
      Main: {
        template: `<resource name="dirt" />`
      },
      Miners: {
        template: `
          <buyables group='Miners'/>
        `
      },
      Options: {
        template: `
          <h2>Options. Nothing yet :troll:</h2>
        `
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
    props: ["name"],
    template: `
      <span style='font-size: 18px'>
        <b style='font-size: 24px' :style="{ color: resource.color }">{{format(resource.amount)}}</b>
        {{resource.name}}
      </span>
      <span v-if="resource.production.gt(0)"> (+{{format(resource.production)}}/s)</span>
    `,
    setup(props) {
      const resource = RESOURCES[props.name];
      return {
        resource,
        format
      };
    }
  })
  .component("buyable", {
    props: ["group", "value"],
    template: `
      <tr v-if="key.unl.value" :minerole="key.name.toLowerCase()">
        <td>
          <b>{{key.amt}}× {{key.name}}:</b><br/>
          <span style="font-size: .75em">{{key.desc.value}}</span>
        </td>
        <td><button @click="key.buy()">Cost: {{format(key.cost.value)}}</button></td>
      </tr>
    `,
    setup(props) {
      const key = BUYABLES[props.group].data[props.value];
      return {
        format,
        key
      };
    }
  })
  .component("buyables", {
    props: ["group"],
    template: `
      <table class="buyables">
        <buyable v-for="(_,key) in BUYABLES[group].data" :group=group :value="key"/>
      </table>
    `,
    setup() {
      return { BUYABLES };
    }
  })
  .mount("#app");
