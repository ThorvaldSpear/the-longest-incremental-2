import { reactive } from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";

export const notifications = reactive([]);

export function notify(message) {
  notifications.push({
    message,
    time: Date.now()
  });
}
export function removeNotify(num) {
  notifications.splice(num, 1);
}
