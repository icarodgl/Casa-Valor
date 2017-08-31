const _ = require('lodash')
const { client } = require('./config')

/**
 * Inserir dados no banco
 * 
 * @param {Array<any>} dados 
 */
async function insertDados(dados) {
  let allPromises = []
  client.connect()

  if (!dados || !dados.length || !(dados instanceof Array)) { throw new Error('Erro no parâmetro data ao tentar inserir dados no banco!') }

  let dataBanco = (await dadosBanco())

  dados.forEach(async dado => {

    // pais
    let paisBanco = _.find(dataBanco.pais, pais => pais.nome === dado.pais)
    if (!paisBanco) {
      paisBanco = (await client.query(`INSERT INTO pais (nome) SELECT '${dado.pais}' WHERE NOT EXISTS (SELECT nome FROM pais WHERE nome='${dado.pais}'); SELECT * FROM pais WHERE pais.nome='${dado.pais}';`)).rows[0]
      dataBanco.pais.push(paisBanco)
    }

    // categoria
    // let catBanco = _.find(dataBanco.categoria, cat => cat.nome === dado.categoria && cat.tipo === dado.tipo)
    // if (!catBanco) {
    //   catBanco = (await client.query(`INSERT INTO categoria (nome, tipo) SELECT '${dado.categoria}','${dado.tipo}' WHERE NOT EXISTS (SELECT nome,tipo FROM categoria as cat WHERE cat.nome='${dado.categoria}' AND cat.tipo='${dado.tipo}'); SELECT * FROM categoria as cat WHERE cat.nome='${dado.categoria}' AND cat.tipo='${dado.tipo}';`)).rows[0]
    //   dataBanco.categoria.push(catBanco)
    // }

    // // estado
    // let estadoBanco = _.find(dataBanco.estado, est => est.nome === dado.estado)
    // if (!estadoBanco) {
    //   estadoBanco = (await client.query(`INSERT INTO estado (nome, fk_pais_id) SELECT '${dado.estado}', ${paisBanco.id} WHERE NOT EXISTS (SELECT nome,fk_pais_id FROM estado WHERE estado.nome='${dado.estado}' AND fk_pais_id=${paisBanco.id}); SELECT * FROM estado WHERE estado.nome='${dado.estado}' AND fk_pais_id=${paisBanco.id};`)).rows[0]
    //   dataBanco.estado.push(estadoBanco)
    // }

    // // cidade
    // let cidadeBanco = _.find(dataBanco.cidade, cid => cid.nome === dado.cidade)
    // if (!cidadeBanco) {
    //   cidadeBanco = (await client.query(`INSERT INTO cidade (nome, fk_estado_id) SELECT '${dado.cidade}', ${estadoBanco.id} WHERE NOT EXISTS (SELECT nome,fk_estado_id FROM cidade WHERE cidade.nome='${dado.nome}' AND cidade.fk_estado_id=${estadoBanco.id}); SELECT * FROM cidade WHERE cidade.nome='${dado.nome}' AND cidade.fk_estado_id=${estadoBanco.id};`)).rows[0]
    //   dataBanco.cidade.push(cidadeBanco)
    // }

    // // imovel
    // let imovel = (await client.query(`INSERT INTO imovel (id, preco, area, data, fk_cidade_id) SELECT ${dado.id},${dado.preco},${dado.area},'${dado.data}',${cidadeBanco.id} WHERE NOT EXISTS (SELECT * FROM imovel WHERE imovel.id=${dado.id}); SELECT * FROM imovel WHERE imovel.id=${dado.id};`)).rows[0]

    // // categoria do imovel
    // let promiseQuery = client.query(`INSERT INTO cat_imo (fk_categoria_id, fk_imovel_id) SELECT ${catBanco.id},${imovel.id} WHERE NOT EXISTS (SELECT * FROM cat_imo as c WHERE c.fk_categoria_id=${catBanco.id} AND c.fk_imovel_id=${imovel.id});`)
    // allPromises.push(promiseQuery)
    allPromises.push(paisBanco)
  })

  return Promise.all(allPromises).then(() => client.end())

}

/**
 * Obter dados que já estão cadastrados no banco
 * 
 * @returns { categoria:Array, cidade:Array, estado:Array, pais:Array }
 */
async function dadosBanco() {
  return {
    categoria: (await client.query('SELECT * FROM categoria')).rows,
    cidade: (await client.query('SELECT * FROM cidade')).rows,
    estado: (await client.query('SELECT * FROM estado')).rows,
    pais: (await client.query('SELECT * FROM pais')).rows
  }
}

module.exports = insertDados
