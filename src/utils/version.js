import { player } from "../player.js";
import { setupVue } from "../setup.js";
import { notify } from "./notify.js";

export const ver = {
  phase: "alpha",
  rc: 0,
  dev: 0,

  release: 0,
  layers: 1,
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

  return (
    phases[0] +
    x.release +
    "." +
    x.layers +
    (x.content ? "." + x.content : "") +
    (x.patch ? "-p" + x.patch : "") +
    (x.rc ? "-rc" + x.rc : "") +
    (x.dev ? "-" + phases[1] + x.dev : "")
  );
}

export function updateVer() {
  if (gtVer(ver, player.ver)) {
    notify("The game has been successfuly updated to " + verName(ver) + "!");
    delete player.won;
  }
  player.ver = ver;
}

function verColoring(x) {
  switch (x.phase) {
    default:
      return "";
    case "beta":
      return "#00f";
    case "alpha":
      return "#f00";
    case "delta":
      return "#0f0";
  }
}

setupVue.version = {
  template: `
    <div
      id="version"
      :style="{ color: verColoring(ver) }"
    >
      {{verName(ver)}}
    </div>
  `,
  setup() {
    return {
      ver,
      verName,
      verColoring
    };
  }
};
