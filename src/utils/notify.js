import { setupVue } from "../setup.js";
import { reactive } from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";

const notifications = reactive([]);

export function notify(message, args) {
  notifications.push({
    message,
    time: Date.now(),
    duration: 10,
    dismissable: true,
    close: false,
    ...args
  });
}
function removeNotify(num) {
  if (notifications?.[num]?.dismissable) {
    notifications[num].close = true;
    notifications.splice(num, 1);
  }
}
function removeAllNotifs() {
  notifications.splice(0);
}

setupVue.notifications = {
  data() {
    return {
      int: undefined
    };
  },
  template: `
    <div id="notifyarea">
      <transition-group name="fade">
        <div v-if="notif.length > 1" class="notification closeAll" @click="removeAllNotifs()">
          Close all
        </div>
        <div
          v-for="(notify, i) in notif"
          class="notification"
          :class="{
            dismissable: notify.dismissable,
          }"
          :key="notify.time"
          @click="removeNotify(notif.length - i - 1)"
        >
          {{notify.message}}
        </div>
      </transition-group>
    </div>
  `,
  mounted() {
    this.int = setInterval(() => {
      for (const [i, notif] of this.notifications.entries()) {
        if (
          (Date.now() - notif.time) / 1000 > notif.duration &&
          notif.dismissable
        ) {
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
      removeNotify,
      removeAllNotifs
    };
  }
};
