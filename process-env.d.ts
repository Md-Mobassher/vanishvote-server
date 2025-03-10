declare namespace NodeJS {
  export type ProcessEnv = {
    NODE_ENV: string
    PORT: number
    DATABASE_URL_LOCAL: string
    DATABASE_URL: string
    FRONTEND_URL_LIVE: string
    FRONTEND_URL_LOCAL: string
  }
}
