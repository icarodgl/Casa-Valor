const log = require('pretty-log')
const ProgressBar = require('ascii-progress')

let i = 0
let _monitor = true

/**
 * Monitoring
 * Singleton class
 * 
 * @class Monitor
 */
class Monitor {

  Monitor() {
    this._instance = null
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

  static get monitor() { return _monitor }
  static set monitor(monitor) { _monitor = monitor }

  /**
   * Start log monitor
   * 
   * @param {string} schema 
   * @param {number} [total=100] 
   * @memberof Monitor
   */
  start(schema, total = 100) {
    if (!Monitor.monitor) { return }
    if (!schema) { throw new Error('Invalid progress bar') }
    this._bar = new ProgressBar({
      schema: schema,
      total: total,
      blank: '░',
      clear: false
    })
  }

  /**
   * Update progress bar
   * 
   * @param {number} delta 
   * @param {any} args 
   * @memberof Monitor
   */
  tick(delta, args) {
    if (!Monitor.monitor) { return }
    this._bar.tick(delta, args)
  }

  /**
   * Clear progress bar
   * 
   * @returns 
   * @memberof Monitor
   */
  clearProgressBar() {
    if (!Monitor.monitor) { return }
    return this._bar.clear()
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

}

module.exports = Monitor