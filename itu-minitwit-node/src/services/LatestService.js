module.exports = class LatestService {
  constructor () {
    this.latest = 0
  }

  getLatest () {
    return this.latest
  }

  updateLatest (number) {
    this.latest = number
  }
}
