import D from "./break_eternity.js";
export class Layer {
  constructor({
    index,
    name,
    features,
    currencyAmt,
    currencyName,
    gainFormula,
    miscData,
    doPrestige = function () {},
    resetLayer = function (n) {}
    // i am pulling this all out of my ass
  }) {
    // i really hope i'm donig this right
    //  hopefully
    // yeah you're probably right
    this.name = name;
    this.features = features;
    this.index = index;
    this.currencyAmt = currencyAmt;
    this.currencyName = currencyName;
    this.gainFormula = gainFormula;
    this.miscData = miscData;
    this.doPrestige = doPrestige;
    this.resetLayer = resetLayer;
  }
  playerLayer() {
    return {
      currency: D(0),
      upgrades: [],
      milestones: [],
      challenges: [],
      ...this.miscData()
    };
  }
  doPrestige() {}
  resetLayer(name) {}
}
