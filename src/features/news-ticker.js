import { setupVue } from "../setup.js";

const newsMessages = [
  [
    "Don't we ever just stop and ask about the morality of this whole thing?",
    () => true
  ]
];

setupVue.newsTicker = {
  template: `
    <div class="newsTicker">
      <div class="newsMessage"></div>
    </div>
  `,
  setup() {
    return {
      newsMessages
    };
  }
};
