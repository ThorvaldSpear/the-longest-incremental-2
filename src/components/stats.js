import { player } from "../player.js";
import { format, formatTime } from "../utils/format.js";
import { TABS } from "./tabs.js";
import { hasUpgrade } from "./buyables.js";

TABS.Stats = {
  subtabs: ["StatsLayer0" /*, "StatsHistory"*/]
};

TABS.StatsLayer0 = {
  disp: "Layer 0",
  subtabs: ["StatsMain", "BlockStats", "OreStats"]
};

TABS.StatsMain = {
  disp: "Main",
  component: {
    template: `
      <table>
        <tr>
          <td><h3>Time Played</h3></td>
          <td>{{formatTime(stats.time)}}</td>
        </tr>
        <tr>
          <td><h3>Best Green Papers</h3></td>
          <td>{{format(stats.max)}}</td>
        </tr>
        <tr>
          <td><h3>Block Hits</h3></td>
          <td>{{format(stats.hits, 0)}}</td>
        </tr>
        <tr>
          <td><h3>Blocks Mined</h3></td>
          <td>{{format(stats.mined, 0)}}</td>
        </tr>
        <tr>
          <td><h3>Treasures Found</h3></td>
          <td>{{format(stats.treasures, 0)}}</td>
        </tr>
        <tr v-if="hasUpgrade('GreenPapers', 3)">
          <td><h3>Rows cleared in Maps</h3></td>
          <td>{{format(stats.mapRows, 0)}}</td>
        </tr>
      </table>
    `,
    setup() {
      return {
        stats: player.stats,
        format,
        formatTime,
        hasUpgrade
      };
    }
  }
};
