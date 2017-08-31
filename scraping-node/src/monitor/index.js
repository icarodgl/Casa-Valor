const log = require('pretty-log')
const ProgressBar = require('ascii-progress')

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
    this._bar = null
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
    this._bar = new ProgressBar({
      schema: ':percent (.white.bold:bar.brightGreen).white.bold | .white Memória utilizada\: :mem Mb .red | .white Tempo decorrido\: :elapsed .yellow',
      total: 100,
      blank: '░',
      clear: true
    })

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

  tick(delta) {
    this._bar.tick(delta, {
      mem: fix2decimals(process.memoryUsage().rss / 1024 / 1024).toString()
    })
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