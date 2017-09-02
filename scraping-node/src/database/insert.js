const _ = require('lodash')
const ProgressBar = require('ascii-progress')
const { client } = require('./config')
const monitor = require('../monitor').getInstance()

let pgDataPromise
client.connect(err => {
  if (err) { return handleError(err) }
  pgDataPromise = getPgData()
})

async function insertData(dataArr) {

  monitor.start('Saving to database (.white.bold:bar.brightBlue).white.bold :percent', 100)

  let pgData = await pgDataPromise.catch(handleError)
  let i = 0
  
  setTimeout(() => monitor.tick(50), 1500)

  client.end(handleError)

  return []

}

/**
 * Obter dados que já estão cadastrados no banco
 * 
 * @returns {Promise<{ categoria:Array, cidade:Array, estado:Array, pais:Array }>}
 */
async function getPgData() {
  data = {
    categoria: (await client.query('SELECT * FROM categoria;')).rows,
    cidade: (await client.query('SELECT * FROM cidade;')).rows,
    estado: (await client.query('SELECT * FROM estado;')).rows,
    pais: (await client.query('SELECT * FROM pais;')).rows
  }
  return data
}

function handleError(err) {
  if (err) {
    throw err
  }
}

module.exports = insertData
