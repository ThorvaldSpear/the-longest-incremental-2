export class Milestone {
  constructor({ title, description, condition, onGive }) {
    this.title = title;
    this.description = description;
    this.condition = condition;
    this.onGive = onGive ?? function () {};
  }
}
