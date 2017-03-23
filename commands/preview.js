/**
 * @fileOverview `preview` command
 * @author Eric Gardner / Getty Publications
 * @license MIT
 */

const chalk = require('chalk')
const cwd = require('cwd')
const path = require('path')
const spawn = require('child_process').spawn
const util = require('../util/util.js')

const WEBPACK_BIN = './node_modules/.bin/webpack'

/** @module preview */
module.exports = function() {
  if (util.dirIsValidProject()) {
    let themePath = path.join(cwd(), 'themes', util.themeName())
    spawn(WEBPACK_BIN, ['--watch'], { cwd: themePath, stdio: 'inherit' })
    spawn('hugo', ['server'], { stdio: 'inherit' })
    return true
  } else {
    console.log(chalk.yellow('No valid project exists at this location.'))
    return false
  }
}
