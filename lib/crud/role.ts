import { Firestore, getDoc, setDoc } from 'firebase/firestore'
import { ZRole } from '../schema/role'
import { FirestoreCrud } from './firestore'

export class RoleCrud {
  private firestoreCrud
  constructor(db: Firestore, orgId: string) {
    this.firestoreCrud = new FirestoreCrud(db, orgId, 'role', ZRole)
  }

  async add(userId: string) {
    const ref = this.firestoreCrud.doc(userId)
    const doc = await this.firestoreCrud.get(ref)
    if (!doc.data) {
      await setDoc(ref, { admin: false })
    }
  }

  async addAdmin(userId: string) {
    const ref = this.firestoreCrud.doc(userId)
    return setDoc(ref, { admin: true })
  }

  async get(userId: string) {
    const ref = this.firestoreCrud.doc(userId)
    return getDoc(ref)
  }
}
