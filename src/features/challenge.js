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
    this.complete =
      complete ??
      function () {
        return false;
      };
    this.onEnter = onEnter ?? function () {};
    this.rewardDescription = rewardDescription;
  }
}
