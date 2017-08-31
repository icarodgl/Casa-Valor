#!/usr/bin/env node
const { writeFile } = require('fs')
const olxRequest = require('./olx-request')
const { insert } = require('./database')
const args = require('./args')
const monitor = require('./monitor').getInstance()

function main() {

  if (args.monitor) { monitor.start() }

  olxRequest(args.pages, args.states).then(data => {

    monitor.end()

    if (args.postgres) {
      insert(data).then(() => {
        monitor.success(`Data entered in the database successfully!`)
      })
    }

    if (args.filename && args.filename.length) {
      writeFile(args.filename[0], JSON.stringify(data), () => monitor.success(`Data saved to file successfully! File: "${args.filename[0]}"`))
    }

  })
}

main()
