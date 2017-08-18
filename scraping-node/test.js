const rp = require('request-promise')
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

rp({
  uri: `http://es.olx.com.br/imoveis?o=${0}`,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36'
  }
})
  .then(body => {
    console.log(body.indexOf("&nbsp"))
  })