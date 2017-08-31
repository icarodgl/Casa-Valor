const log = require('pretty-log')

let i = 0

/**
 * Monitoring
 * Singleton class
 * 
 * @class Monitor
 */
class Monitor {

  Monitor() {
    this._instance = null
    this._progress = null
    this._started = false
    this._keep = false
  }

  /**
   * Get instance
   * Singleton
   * 
   * @static
   * @returns 
   * @memberof Monitor
   */
  static getInstance() {
    if (!this._instance) { this._instance = new Monitor() }
    return this._instance
  }

  /**
   * Start log monitor
   * 
   * @returns 
   * @memberof Monitor
   */
  start() {
    if (this._started) { return }
    this._started = true
    this._keep = true
    
    return keep.apply(this)

    function keep() {
      if (this._keep) {
        if (i > 2) { i = 0 }
        this._clear.apply(this)
        process.stdout.write(
          `${fix2decimals(this.progress || 0)}% | Memória utilizada: ${fix2decimals(process.memoryUsage().rss / 1024 / 1024)} Mb ${new Array(++i).fill('.').join('')}`
        )
        return setTimeout(() => keep.apply(this), 200)
      }
    }

  }

  /**
   * End log monitor
   * 
   * @memberof Monitor
   */
  end() {
    if (!this._keep) { return }
    this._clear()
    this._keep = false
  }

  /**
   * Success log
   * 
   * @returns 
   * @memberof Monitor
   */
  success() {
    return log.success(...arguments)
  }

  /**
   * Error log
   * 
   * @returns 
   * @memberof Monitor
   */
  error() {
    return log.error(...arguments)
  }

  /**
   * Progress string get
   * 
   * @memberof Monitor
   */
  get progress() {
    return this._progress
  }

  /**
   * Progress string set
   * 
   * @memberof Monitor
   */
  set progress(num) {
    if (typeof num !== 'number') { throw new Error('Set progress error: The type must be number') }
    this._progress = num
  }

  /**
   * Clear console
   * 
   * @private
   * @memberof Monitor
   */
  _clear() {
    process.stdout.clearLine();  // clear current text
    process.stdout.cursorTo(0);  // move cursor to beginning of line
  }

}

/**
 * Fix decimals
 * 
 * @param {any} n 
 * @param {number} [fixed=2] 
 * @returns 
 */
function fix2decimals(n, fixed = 2) {
  return parseFloat(Math.round(n * 100) / 100).toFixed(fixed)
}

module.exports = Monitor