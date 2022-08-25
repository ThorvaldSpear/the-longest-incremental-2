import { createApp } from "https://unpkg.com/vue@3.2.37/dist/vue.esm-browser.js";
import { buildings } from "./features/buildings.js";
import { player, runGame } from "./features/player.js";

// VERY MUCH FOR TESTING
createApp()
  .component("main-app", {
    template: `Hello world. 
    You have {{player.points.toLocaleString("en-US")}} points.
    <table>
      <tbody>
        <building v-for="(_,key) in buildings" :id="key" />
      </tbody>
    </table>`,
    setup() {
      return {
        player,
        buildings
      };
    },
    mounted() {
      runGame()
    }
  })
  .component("building", {
    props: ["id"],
    template: `
      <tr>
        <td>{{build.name}}</td>
        <td>({{build.desc.value}})</td>
        <td><button @click="build.buy()">Cost: {{build.cost}} points</button></td>
      </tr>`,
    setup(props) {
      const build = buildings[props.id];
      console.log(build)
      return {
        build
      };
    }
  })
  .mount("#app");
/*function gwa() {
  for (let i=0;i<=100;i++) console.log("GWA :gwa: :gwappog: :gwatroll:")
}
*/
