/////////////////////////////////// :cat:
export class Achievement {
  constructor({ title, tooltip, condition, onGive }) {
    this.title = title;
    this.tooltip = tooltip;
    this.condition = condition;
    this.onGive = onGive ?? function () {};
  }

  give(force = false) {
    // stuff happens pog
  }
}
