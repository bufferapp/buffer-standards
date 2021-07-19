import * as env from 'env-var'

export const APP_STAGE = env
    .get('NODE_ENV')
    .default('production')
    .asString()

export const DB_STAGE = env
    .get('DB_STAGE')
    .default('mocks')
    .asString()