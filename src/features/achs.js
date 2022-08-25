/**
 * Class for Achievements.
 */
export class Achievement {
  /**
   *
   * @param {object} data An object containing achievement data.
   * @param {string} data.title Achievement title, appears on the achievement.
   * @param {string} data.tooltip Achievement tooltip, shown when you hover the achievement.
   * @param {() => boolean} data.condition A function returning boolean indicating whenever you can get the achievement or no.
   * @param {() => void} data.onGive A function that will be called when you get this achievement.
   */
  constructor({ title, tooltip, condition, onGive }) {
    this.title = title;
    this.tooltip = tooltip;
    this.condition = condition;
    this.onGive = onGive ?? function () {};
  }

  /**
   * Gives this achievement to the player.
   * @param {boolean} force Whenever to ignore achievement requirmento or no.
   */
  give(force = false) {
    // stuff happens pog
  }
}
