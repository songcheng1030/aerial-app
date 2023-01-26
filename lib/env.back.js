const { envsafe, str } = require('envsafe')
const { envFront } = require('./env.front')

module.exports = {
    envBack: {
    ...envFront,
    ...envsafe({
      NODE_ENV: str({
        devDefault: 'development',
        choices: ['development', 'test', 'production'],
      }),
      MONGODB_URI: str(),
      MONGODB_DB: str({ devDefault: 'test' }),
      AWS_S3_ACCESS_KEY_ID: str(),
      AWS_S3_SECRET_KEY: str(),
      AWS_S3_BUCKET: str({
        devDefault: 'demo-aerial-ops',
      }),
      PDF_TRON_SECRET: str(),
    }),
  }
}
