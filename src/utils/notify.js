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
    setTimeout(() => notifications.splice(num, 1), 200);
  }
}

setupVue.notifications = {
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
        :class="{
          close: notify.close,
        }"
        :key="notify.time"
        @click="removeNotify(notif.length - i - 1)"
      >
        {{notify.message}}
      </div>
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
      removeNotify
    };
  }
};
