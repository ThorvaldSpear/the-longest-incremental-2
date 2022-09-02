import { ref } from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";
import { setupVue } from "../setup.js";
import { player } from "../player.js";
import { random } from "../utils/utils.js";
import { hasUpgrade } from "./buyables.js";

// please put only news in this overwise use the random title feature
const newsMessages = [
  [
    'As always, the News Ticker Transport Prism depends on you to maintain the service running. Direct your magic to <a href="https://discord.gg/fcEXYjPQ43" target="_blank">this underlined running text</a> to instantly transport yourself to the council headquarters if you wish to create submissions. You\'ve been reading the NTTP.'
  ],
  [
    'Man arrested for trying to use forbidden rift magic, saying "this universe doesn\'t contain any waifus" when asked why.'
  ],
  [
    "If you're feeling suck because you're transported to a new world with no one to follow you, remember that you're still lucky enough to not randomly get killed in the middle of episode 1 with explanations not appearing until much later on."
  ],
  [
    'Royal magicians have made a breakthrough when they discovered the secrets of irreversible time-freezing magic. It turns out all you need to do is saying "the next update is in 5 hours away" wait did I just say that OH GOD F-'
  ],
  [
    "A community-owned newspaper press has to forcefully shut down after too many people submitted inside jokes as news. Now they only reuse news headlines from previous entries and reprint them for comedical purposes."
  ],
  [
    'The neighboring kingdom had to close borders to investigate for potential forbidden rift magic users as too many people were claiming to come from a non-existant country called "Japan"'
  ],
  [
    'Local ore mine managed to convince people to buy ores at a considerable markup by marketing their ores as "SSH Hashed" despite no one really knows what that phrase actually means.',
    () => hasUpgrade("GreenPapers", 8)
  ],

  [
    "The king needs magical artifacts in order to look out for anomalies. The progress they are making is steady yet.",
    () => false
  ]
];

/* newsMessages.push([
  `funny fact: there are ${
    newsMessages.length + 1
  } news ticker messages, but only none gives you actual tips, the rest of them are either jokes or trolls`
]); */

const newsPosition = ref(-Infinity);
const newsValue = ref();
let lastNewsPos = Date.now();

export function tickNews() {
  const diff = (Date.now() - lastNewsPos) / 1000;
  lastNewsPos = Date.now();
  newsPosition.value -= diff * 120;

  if (!player.options.news) return;
  if (
    newsPosition.value <
      -document.querySelector(".newsMessage")?.clientWidth - 25 ??
    Infinity
  )
    newNewsMessage();
}

function newNewsMessage() {
  const newsCandidates = newsMessages.filter((i, ind) => {
    if (i === undefined) {
      console.warn("NEWS TICKER IS UNDEFINED AT " + ind);
      return false;
    }
    return i[1] === undefined || i[1]();
  });
  newsValue.value = random(newsCandidates);
  newsPosition.value = document.querySelector(".newsTicker")?.clientWidth + 25;
}

setupVue.news = {
  // this is not reactive
  // therefore it will not get tracked by vue
  // and updated
  // go use a ref or smh
  computed: {
    style() {
      const style = {
        "margin-left": this.newsPosition + "px",
        transition: this.oldPosition > this.newsPosition ? ".2s" : ""
      };
      this.oldPosition = this.newsPosition;
      return style;
    },
    newsMsg() {
      return this.newsValue?.[0];
    }
  },
  template: `
    <div v-if="player.options.news" class="newsTicker">
      <div
        :style="style"
        v-html="newsMsg"
        class="newsMessage"
      ></div>
    </div>
  `,
  setup() {
    return {
      player,
      newsPosition,
      newsValue
    };
  }
};
