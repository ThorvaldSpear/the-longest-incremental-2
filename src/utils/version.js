import { player } from "../player.js";
import { setupVue } from "../setup.js";
import { notify } from "./notify.js";

export const ver = {
  phase: "delta",
  dev: 6,

  release: 0,
  layers: 0,
  content: 0,
  patch: 0
};

function getVer(x) {
  if (typeof x === "string") {
    x = x.split(".");
    return {
      release: Number(x[0]) || 0,
      layers: Number(x[1]) || 0,
      content: Number(x[2]) || 0
    };
  }
  return x;
}

function gtVer(x, y) {
  x = getVer(x);
  y = getVer(y);

  return (
    x.release > y.release ||
    (x.release === y.release &&
      (x.layers > y.layers || (x.layers === y.layers && x.content > y.content)))
  );
}

function verName(x) {
  let phases = ["v", "β"];
  if (x.phase === "beta") phases = ["β", "α"];
  if (x.phase === "alpha") phases = ["α", "δ"];
  if (x.phase === "delta") phases = ["δ", "build"];
  console.log(x);

  return (
    phases[0] +
    x.release +
    "." +
    x.layers +
    (x.content ? "." + x.content : "") +
    (x.patch ? "-p" + x.patch : "") +
    (x.dev ? "-" + phases[1] + x.dev : "")
  );
}

export function updateVer(x) {
  if (gtVer(ver, player.ver))
    notify("The game has been successfuly updated to " + verName(ver) + "!");
  player.ver = ver;
}

setupVue.version = {
  template: `
    <div id="version">{{verName(ver)}}</div>
  `,
  setup() {
    return {
      ver,
      verName
    };
  }
};
