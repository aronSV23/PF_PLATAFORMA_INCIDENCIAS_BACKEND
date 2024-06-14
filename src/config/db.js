import { createPool } from 'mysql2/promise'
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME } from './config.js'

export const pool = createPool({
  port: DB_PORT,
  database: DB_DATABASE,
  user: DB_USERNAME,
  host: DB_HOST,
  password: DB_PASSWORD
})
