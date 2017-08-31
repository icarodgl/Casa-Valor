const { ArgumentParser } = require('argparse')
const _ = require('lodash')
const allStates = require('../all-states.json')
const monitor = require('../monitor').getInstance()
const parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Argumentos scraping node',
  prog: 'node src/main',
  usage: '%(prog)s [-pg][--postgres] [-f][--filename] <filename> [-s][--states] <states1> ... <statesn>'
});

/**
 * Definição de parâmetros da aplicação
 */
[
  {
    arg: ['-pg', '--postgres'],
    options: {
      help: 'Save postgress database',
      nargs: 1,
      action: 'storeTrue'
    }
  },
  {
    arg: ['-f', '--filename'],
    options: {
      help: 'Nome do arquivo de saída',
      nargs: 1
    }
  },
  {
    arg: ['-s', '--states'],
    options: {
      help: 'Sigla do(s) estado(s) que deseja obter os dados. Ex: -s es rj sp',
      nargs: '*',
      required: true
    }
  },
  {
    arg: ['-p', '--pages'],
    options: {
      help: 'Number of pages for request. Default 1.',
      defaultValue: 1,
      nargs: 1
    }
  },
  {
    arg: ['-m', '--monitor'],
    options: {
      help: 'Monitor application activities',
      nargs: 1,
      action: 'storeTrue'
    }
  }
].forEach(obj => parser.addArgument(obj.arg, obj.options))

const args = parser.parseArgs()

if (!args.states || !args.states.length) {
  parser.printHelp()
  parser.exit(1)
}

let diff = _.difference(args.states, allStates)
if (diff.length) {
  diff.forEach(state => monitor.error(`Estado inválido: ${state}`))
  parser.exit(1)
}

if (!args.postgres && !args.filename) {
  console.error('A file name or database name is required to save the data\n')
  parser.printHelp()
  parser.exit(1)
}

module.exports = args