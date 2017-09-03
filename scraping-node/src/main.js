#!/usr/bin/env node
const { writeFile } = require('fs')
const ProgressBar = require('ascii-progress')
const olxRequest = require('./olx-request')
const { insert } = require('./database')
const args = require('./args')
const monitor = require('./monitor').getInstance()

function main() {

  monitor.start('Getting data from the server.white :percent (.white.bold:bar.brightGreen).white.bold | .white Used memory\: :mem Mb .red', 100)

  olxRequest(args.pages, args.states).then(data => {
    monitor.clearProgressBar()
    if (args.postgres) {
      insert(data).catch(handleError).then(() => {
        monitor.success(`Data entered in the database successfully!`)
      })
    }

    if (args.filename && args.filename.length) {
      writeFile(args.filename[0], JSON.stringify(data), () => monitor.success(`Data saved to file successfully! File: "${args.filename[0]}"`))
    }

  }).catch(handleError)
}

function handleError (err) {
  if (err) {
    monitor.error(err ? err.stack || err : 'Undefined error')
    process.exit(2)
  }
}

main()
