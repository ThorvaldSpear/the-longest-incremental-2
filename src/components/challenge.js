export class Challenge {
  constructor({
    title,
    description,
    complete,
    onEnter,
    rewardDescription,
    effect
  }) {
    this.title = title;
    this.description = description;
    this.complete = complete ?? (() => false);
    this.onEnter = onEnter ?? function () {};
    this.rewardDescription = rewardDescription;
  }
}
