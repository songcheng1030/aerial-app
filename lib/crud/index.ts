import { Firestore } from 'firebase/firestore'
import { db as _db } from '../firebase'
import {
  ZAdvisor,
  ZCommon,
  ZContractor,
  ZDirector,
  ZDoc,
  ZEmployee,
  ZFundraising,
  ZLocalCorporation,
  ZOfficer,
  ZOption,
  ZOptionPlan,
  ZPreferred,
  ZSafe,
  ZStateCorporation,
  ZValuation,
} from '../schema'
import { ZRole } from '../schema/role'
import { FirestoreCrud } from './firestore'

export const mkCruds = (db: Firestore, orgId: string) => ({
  role: new FirestoreCrud(db, orgId, 'role', ZRole),
  doc: new FirestoreCrud(db, orgId, 'doc', ZDoc),
  employee: new FirestoreCrud(db, orgId, 'employee', ZEmployee),
  officer: new FirestoreCrud(db, orgId, 'officer', ZOfficer),
  director: new FirestoreCrud(db, orgId, 'director', ZDirector),
  advisor: new FirestoreCrud(db, orgId, 'advisor', ZAdvisor),
  contractor: new FirestoreCrud(db, orgId, 'contractor', ZContractor),
  state: new FirestoreCrud(db, orgId, 'state', ZStateCorporation),
  local: new FirestoreCrud(db, orgId, 'local', ZLocalCorporation),
  common: new FirestoreCrud(db, orgId, 'common', ZCommon),
  option: new FirestoreCrud(db, orgId, 'option', ZOption),
  optionPlan: new FirestoreCrud(db, orgId, 'optionPlan', ZOptionPlan),
  safe: new FirestoreCrud(db, orgId, 'safe', ZSafe),
  preferred: new FirestoreCrud(db, orgId, 'preferred', ZPreferred),
  valuation: new FirestoreCrud(db, orgId, 'valuation', ZValuation),
  fundraising: new FirestoreCrud(db, orgId, 'fundraising', ZFundraising),
})

export const cruds = mkCruds(_db, 'demo-org')
