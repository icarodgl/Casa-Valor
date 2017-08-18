const rp = require('request-promise')
const cheerio = require('cheerio')
const _ = require('lodash')
const fs = require('fs')

let dados = []

const dict = {
  "&aacute;": "á",
  "&agrave;": "à",
  "&iacute;": "í",
  "&ocirc;": "ô",
  "&Aacute;": "Á",
  "&Agrave;": "À",
  "&Iacute;": "Í",
  "&Ocirc;": "Ô",
  "&atilde;": "ã",
  "&eacute;": "é",
  "&oacute;": "ó",
  "&uacute;": "ú",
  "&Atilde;": "Ã",
  "&Eacute;": "É",
  "&Oacute;": "Ó",
  "&Uacute;": "Ú",
  "&acirc;": "â",
  "&ecirc;": "ê",
  "&otilde;": "õ",
  "&ccedil;": "ç",
  "&Acirc;": "Â",
  "&Ecirc;": "Ê",
  "&Otilde;": "Õ",
  "&Ccedil;": "Ç"
}

/**
 * Get default request promise options for scraping
 * 
 * @param {number} [page=0] 
 * @returns 
 */
function getOptionsOLX(page = Math.round(Math.random() * 10)) {
  return {
    uri: `http://es.olx.com.br/imoveis?o=${page}`,
    transform: body => {
      Object.keys(dict).forEach(tag => {
        while (body.indexOf(tag) !== -1) {
          body = body.replace(tag, dict[tag])
        }
      })
      return cheerio.load(body)
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36'
    }
  }
}

/**
 * Tratamento da região do anúncio
 * 
 * @param {any} el 
 * @returns 
 */
function tratamentoRegiao(el) {
  return el.trim().split('-').map(a => a.trim()).filter(b => b.length)
}


function fillDados() {

  return new Promise((resolve, reject) => {
    resolve(_fillDados())
  })

  function _fillDados(index = 0) {
    let options = getOptionsOLX(index)
    console.log(`Obtendo dados a partir da uri: ${options.uri}`)
    return rp(options)
      .then($ => {
        const list = $('div.section_OLXad-list')
        const estado = $('h2').text()
        list.find('li.item').filter(function (i, el) {
          el = $(el)
          return el.attr('class') === 'item'
        }).each(function (i, item) {
          item = $(item)
          const id = item.find('a.OLXad-list-link').attr('id')
          const regiao = _.flatten(item.find('p.text.detail-region').text().trim().split(',').map(tratamentoRegiao))
          const bairro = regiao.length < 3 ? null : regiao[1]
          const cidade = regiao[0]
          const categoria = item.find('p.detail-category').text().trim().split('-').map(a => a.trim().toLowerCase())[0]
          let preco = item.find('p.OLXad-list-price').text().trim().split(' ').filter(a => a.length)
          preco = preco.length === 0 ? null : Number(preco[1].replace('.', ''))

          dados.push({
            bairro, cidade, categoria, preco, id
          })

        })
        return index < 100 ? _fillDados(++index) : Promise.resolve()
      })
  }

}

function main() {

  fillDados()
    .then(() => {
      fs.writeFileSync('./dados.json', JSON.stringify(dados), err => { throw err })
      console.log('Dados gerados com sucesso!')
    })
    .catch(err => {
      throw err
    })

}

main()