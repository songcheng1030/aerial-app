import { cruds } from '../lib/crud'

// Change this id based on what you need
const id = 'IBhKFHBD6eRdj3Y83T10'

const main = async () => {
  console.log((await cruds.valuation.get(id)).data?.startDate)
  await cruds.valuation.update(id, { startDate: { value: new Date(), type: 'computed' } })
  console.log((await cruds.valuation.get(id)).data?.startDate)
  process.exit(0) // Must manually exit
}

if (require.main === module) {
  main()
}
