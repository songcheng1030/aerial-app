import { CollectionReference, getDocs, query } from 'firebase/firestore'
import { cruds } from '../lib/crud'
import { mkBatch } from '../lib/firebase'

const deleteBatch = async (collection: CollectionReference) => {
  const batch = mkBatch()
  const snap = await getDocs(query(collection))
  snap.docs.forEach((snap) => batch.delete(snap.ref))
  return batch.commit()
}

const main = async () => {
  await deleteBatch(cruds.doc.collection)
  await deleteBatch(cruds.employee.collection)
  await deleteBatch(cruds.officer.collection)
  await deleteBatch(cruds.advisor.collection)
  await deleteBatch(cruds.contractor.collection)
  await deleteBatch(cruds.director.collection)
  await deleteBatch(cruds.valuation.collection)
  await deleteBatch(cruds.optionPlan.collection)
  await deleteBatch(cruds.fundraising.collection)
  await deleteBatch(cruds.state.collection)
  await deleteBatch(cruds.local.collection)
  await deleteBatch(cruds.safe.collection)
  await deleteBatch(cruds.preferred.collection)
  await deleteBatch(cruds.option.collection)
  await deleteBatch(cruds.common.collection)
  process.exit()
}

if (require.main === module) {
  main()
}
