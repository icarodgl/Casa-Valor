const iconv = require('iconv-lite')
const cheerio = require('cheerio')

/**
 * Obter opções da requisição na OLX
 * para ser usado no request-promise
 * 
 * @export
 * @param {any} [page=Math.round(Math.random() * 10)] 
 * @param {string} [state='es'] 
 * @returns {any}
 */
module.exports = function getOptionsOLX(page = Math.round(Math.random() * 10), state = 'es') {
  return {
    uri: `http://${state}.olx.com.br/imoveis?o=${page}`,
    encoding: null,
    transform: html => {
      return cheerio.load(iconv.decode(html, 'ISO-8859-1'), { decodeEntities: false })
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36'
    }
  }
}
