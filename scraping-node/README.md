# Node.js web scraper OLX Imóveis

## Dados

Os dados são obtidos através do endpoint http://`<estado>`.olx.com.br/imoveis?o=`<pagina>` e salvos em um arquivo para cada estado na pasta [dados](dados), caso não seja definido um local específico.

## Requisitos

* NodeJS 7.*
* npm 4.*

## Iniciando a aplicação

1. Instale as dependências: `$ npm install`
2. Execute o index.js: `$ node index`
  * O script sh obtem dados de 100 páginas de todos estados brasileiros e salva os arquivos json na pasta dados: `sh gerar-dados.sh`

## Parâmetros

* `number`: Número de páginas a ser obtidas. Ex: `number=50`
* `filename`: Nome do arquivo onde os dados serão salvos em formato json. Ex: `filename=/tmp/dados_do_es.json`
* `state`: O estado brasileiro o qual os dados serão obtidos. CUIDADO: Este parâmtro deverá conter apenas a sigla, pois compõe a rota de requisição. Ex: `state=sp`
