const _ = require('lodash')
const ProgressBar = require('ascii-progress')
const sem = require('semaphore')(1)
const escape = require('pg-escape')
const { client } = require('./config')
const monitor = require('../monitor').getInstance()

let pgDataPromise
client.connect(err => {
  if (err) { return handleError(err) }
  pgDataPromise = getPgData().catch(handleError)
})

/**
 * Inserir dados no banco
 * 
 * @param {Array<any>} dataArr 
 * @returns {Promise<void>}
 */
async function insertData(dataArr) {

  let pgData = (await pgDataPromise.catch(handleError))

  monitor.clearProgressBar()
  monitor.start('Saving to database (.white.bold:bar.brightBlue).white.bold :percent', 100)
  const TICK_DELTA = (1 / dataArr.length) * 100

  return new Promise(resolve => {

    let i = 0
    let error

    dataArr.forEach(d => (async data => {

      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string') { data[key] = data[key].replace('\'', '\'\'') }
      })

      let categoriaBanco = _.find(pgData.categoria, cat => cat.nome === data.categoria && data.tipo === data.tipo)
      if (!categoriaBanco) {
        categoriaBanco = (await insertAndReturn('categoria', ['nome', 'tipo'], [`'${data.categoria}'`, `'${data.tipo}'`]).catch(handleError))
        pgData.categoria.push(categoriaBanco)
      }

      let paisBanco = _.find(pgData.pais, pais => pais.nome === data.pais)
      if (!paisBanco) {
        paisBanco = (await insertAndReturn('pais', ['nome'], [`'${data.pais}'`]))
        pgData.pais.push(paisBanco)
      }

      let estadoBanco = _.find(pgData.estado, est => est.nome === data.estado)
      if (!estadoBanco) {
        estadoBanco = (await insertAndReturn('estado', ['nome', 'fk_pais_id'], [`'${data.estado}'`, `${paisBanco.id}`]).catch(handleError))
        pgData.estado.push(estadoBanco)
      }

      let cidadeBanco = _.find(pgData.cidade, cid => cid.nome === data.cidade)
      if (!cidadeBanco) {
        cidadeBanco = (await insertAndReturn('cidade', ['nome', 'fk_estado_id'], [`'${data.cidade}'`, `${estadoBanco.id}`]).catch(handleError))
        pgData.cidade.push(cidadeBanco)
      }

      let imovelResult = (await client.query(`INSERT INTO imovel (id, preco, area, data, fk_cidade_id) SELECT ${data.id},${data.preco},${data.area},'${data.data}',${cidadeBanco.id} WHERE NOT EXISTS (SELECT * FROM imovel WHERE imovel.id=${data.id}) RETURNING *;`).catch(handleError))

      if (imovelResult.rows.length) {
        let imovel = imovelResult.rows[0]
          ; (await client.query(`INSERT INTO cat_imo (fk_categoria_id, fk_imovel_id) VALUES (${categoriaBanco.id},${imovel.id});`).catch(handleError))
      }

      i++
      monitor.tick(TICK_DELTA)
    })(d).catch(err => { error = err ? err : error }))

    let intervalId = setInterval(() => {
      if (error) {
        resolve(handleError(error))
      }
      if (i === dataArr.length) {
        clearInterval(intervalId)
        resolve()
        client.end(handleError)
        monitor.clearProgressBar()
        return
      }
    }, 500)

  })

}

/**
 * * Insert one data if not exists and returning *
 * 
 * @param {any} table 
 * @param {any} fields 
 * @param {any} values 
 * @returns {Promise<any>}
 */
function insertAndReturn(table, fields, values) {
  let where = ''
  fields.forEach((field, index) => {
    where += `${field}=${values[index]}` + (index + 1 === fields.length ? '' : ' AND ')
  })
  return query(`INSERT INTO ${table} (${fields.join()}) SELECT ${values.join()} WHERE NOT EXISTS (SELECT ${fields.join()} FROM ${table} WHERE ${where}) RETURNING *;`)
    .then(res => {
      let rows = res.rows
      if (!rows || !rows.length) {
        return query(`SELECT * FROM ${table} WHERE ${where};`).then(r => r.rows[0]).catch(handleError)
      }
      return rows[0]
    })
    .catch(handleError)
}

/**
 * CLient postgres query with semaphore
 * 
 * @param {any} query 
 * @returns {Promise<any>}
 */
function query(query) {
  if (!query) { throw new Error('No query') }
  return new Promise(resolve => {
    let error
    sem.take(async () => {
      let result = (await client.query(query).catch(err => error = err ? err : error))
      sem.leave()
      error ? resolve(handleError(error)) : resolve(result)
    })
  })
}

/**
 * Obter dados que já estão cadastrados no banco
 * 
 * @returns {Promise<{ categoria:Array, cidade:Array, estado:Array, pais:Array }>}
 */
async function getPgData() {
  data = {
    categoria: (await client.query('SELECT * FROM categoria;').catch(handleError)).rows,
    cidade: (await client.query('SELECT * FROM cidade;').catch(handleError)).rows,
    estado: (await client.query('SELECT * FROM estado;').catch(handleError)).rows,
    pais: (await client.query('SELECT * FROM pais;').catch(handleError)).rows
  }
  return data
}

/**
 * Handle error
 * 
 * @param {any} err 
 * @returns 
 */
function handleError(err) {
  if (err) {
    return Promise.reject(err)
  }
}

module.exports = insertData
