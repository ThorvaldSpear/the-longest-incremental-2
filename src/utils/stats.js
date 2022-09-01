import { player } from "../player.js";
import { format, formatTime } from "../utils/format.js";
import { TABS } from "./tabs.js";

TABS.Stats = {
  component: {
    template: `
      <table>
        <tr>
          <td><h3>Time Played</h3></td>
          <td>{{formatTime(player.stats.time)}}</td>
        </tr>
        <tr>
          <td><h3>Best Green Papers</h3></td>
          <td>{{format(player.stats.max)}}</td>
        </tr>
        <tr>
          <td><h3>Block Hits</h3></td>
          <td>{{format(player.stats.hits, 0)}}</td>
        </tr>
        <tr>
          <td><h3>Blocks Mined</h3></td>
          <td>{{format(player.stats.mined, 0)}}</td>
        </tr>
        <tr>
          <td><h3>Treasures Found</h3></td>
          <td>{{format(player.stats.treasures, 0)}}</td>
        </tr>
      </table>
    `
  },
  setup() {
    return {
      player,
      format,
      formatTime
    };
  }
};
