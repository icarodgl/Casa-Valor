const { Client } = require('pg')

// Configuração do postgres
const { PG_USER, PG_PASSWORD, PG_PORT, PG_DB, PG_SERVER } = process.env
const connectionString = `postgresql://${PG_USER || 'postgres'}:${PG_PASSWORD || ''}@${PG_SERVER || 'localhost'}:${PG_PORT || '5432'}/${PG_DB || 'casavalor'}`

module.exports = {
  client: new Client({ connectionString })
}
