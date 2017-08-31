# Node.js web scraper OLX Imóveis

## Dados

Os dados são obtidos através do endpoint http://`<estado>`.olx.com.br/imoveis?o=`<pagina>` e salvos em um arquivo ou no banco de dados postgres configurado.

## Requisitos

* NodeJS 7.*
* npm 4.*

## Iniciando a aplicação

1. Instale as dependências: `$ npm install`
2. Execute o index.js: `$ node src/main`

O script sh obtem dados de 100 páginas de todos estados brasileiros e salva os arquivos json na pasta dados: `$ sh gerar-dados.sh`

## Parâmetros

* `-h`, `--help`: Exibe informações de ajuda e encerra.
* `-v`, `--version`: Exibe a versão da aplicação e encerra.
* `-pg`, `--postgres`: Salva no banco local (postgres) ou banco configurado via variáveis de ambiente.
* `-f`, `--filename`: Salva os dados em arquivo com o nome passado em formato JSON. Ex: **node src/main -f dados.json**.
* `-s`, `--states`: Estados que os dados serão obtidos. Ex: **node src/main -f dados.json -s es rj mg**.
* `-p`, `--pages`: Número de páginas a ser obtido. Ex **node src/main -f dados.json -s es -p 15**.
* `-m`, `--monitor`: Exibir informações de monitoramento do processo (progresso, memória utilizada, etc...).

## Variáveis de ambiente

* PG_USER => Usuário postgres (default: 'postgres')
* PG_PASSWORD => Senha postgres (default: '')
* PG_PORT => Porta de conexão postgres (default: '5432')
* PG_DB => Nome da database postgres (default: 'casavalor')
* PG_SERVER => Servidor postgres (default: 'localhost')

## Exemplo de uso

1. Com node: `$ node src/main --filename ~/Downloads/dados_es.json -s es -p 20 -m`
2. Com npm: `$ npm start -- -f ./sudeste.json -s es rj mg sp -p 10 -m`
3. Com o arquivo sh: `$ sh gerar-dados.sh` **Obs: Será obtido 100 páginas de todos os estados brasileiros e salvo no banco de dados postgres local ou configurado com variáveis de ambiente**
