import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join((process.cwd(), '.env')) })

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,

  database_url: process.env.DATABASE_URL,
  database_url_local: process.env.DATABASE_URL_LOCAL,

  frontend_url: {
    live: process.env.FRONTEND_URL_LIVE,
    local: process.env.FRONTEND_URL_LOCAL,
  },
}
