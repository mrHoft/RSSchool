class GuessingGame {
  data = {
    min: 0,
    max: 0,
    get mid() {
      return this.min + ~~((this.max - this.min) / 2);
    },
  };

  constructor() {}

  setRange(min, max) {
    this.data.min = min + 1;
    this.data.max = max;
  }

  guess() {
    return this.data.mid;
  }

  lower() {
    this.data.max = this.data.mid;
  }

  greater() {
    this.data.min = this.data.mid + 1;
  }
}

module.exports = GuessingGame;
