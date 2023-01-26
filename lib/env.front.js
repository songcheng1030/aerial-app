const { envsafe, str } = require('envsafe')

module.exports = {
  envFront: envsafe({
    VERCEL_URL: str(),
  })
}
