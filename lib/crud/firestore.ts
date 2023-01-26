import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  FirestoreError,
  getDoc,
  getDocs,
  onSnapshot,
  Query,
  query as _query,
  QueryConstraint,
  QueryDocumentSnapshot,
  QuerySnapshot,
  setDoc,
  SnapshotListenOptions,
  SnapshotMetadata,
  UpdateData,
  updateDoc,
} from 'firebase/firestore'
import React from 'react'
import { z } from 'zod'
import { deepRemoveTransform } from './helper'

export interface SimpleQuerySnapshot<T> {
  metadata: SnapshotMetadata
  docs: SimpleDocumentSnapshot<T>[]
}

export interface SimpleDocumentSnapshot<T> {
  id: string
  path: string
  data: Awaited<T> | undefined
  metadata: SnapshotMetadata
}
/**
 * A Crud object that combines type and collection data for type-safe queries and editing on firestore.
 * Type safety is enforced via `this.schema`, which is a Zod object that is (possibly) `transform`ed.
 * - The pre-transformed Zod schema is the schema stored in the DB.  This schema is saved as `this.input`.
 *   All input data is first checked via `this.input.parse(...)`.
 * - The post-transformed Zod schema is used by front-end clients.  All query output data is passed through
 *   `schema.parseAsync`, which invokes `transform`.  Note that the transform may even perform additional database
 *   calls.
 * The user only supplies `this.schema`, the post-transformed Zod schema and `this.input` is inferred via
 * `deepRemoveTransform`.
 * For more, see https://github.com/colinhacks/zod
 */

export class FirestoreCrud<Input, Output> {
  readonly _input!: Input
  readonly _output!: Output
  public collection: CollectionReference<Input>

  constructor(
    public db: Firestore,
    public orgId: string,
    public name: string,
    public schema: z.ZodType<Output, any, Input>,
    public input: z.ZodType<Input, any, Input> = deepRemoveTransform(schema),
    public deepPartialInput: z.ZodType<Input, any, Input> = z.deepPartialify(input)
  ) {
    this.collection = collection(db, 'org', orgId, name) as CollectionReference<Input>
  }

  doc(id?: string): DocumentReference<Input> {
    if (id) {
      return doc(this.collection, id)
    }
    return doc(this.collection)
  }

  ref(id?: string): DocumentReference<Input> {
    return this.doc(id)
  }

  async parseSnap<T>(snap: DocumentSnapshot<T> | QueryDocumentSnapshot<T>) {
    const data = snap.data()
    return {
      id: snap.ref.id,
      path: snap.ref.path,
      data: data && (await this.schema.parseAsync(data)),
      metadata: snap.metadata,
    }
  }

  async add(input: Input) {
    return addDoc(this.collection, await this.input.parse(input))
  }

  private _toDoc(id: string | DocumentReference<Input>): DocumentReference<Input> {
    if (id instanceof DocumentReference) {
      return id
    }
    return this.doc(id)
  }

  async set(id: string | DocumentReference<Input>, input: Input) {
    return setDoc(this._toDoc(id), await this.input.parse(input))
  }

  async delete(id: string | DocumentReference<Input>) {
    return deleteDoc(this._toDoc(id))
  }

  async update(id: string | DocumentReference<Input>, input: UpdateData<Input>) {
    // HACK: unclear if deepPartialify is the same as UpdateData but hopefully it's close?
    return updateDoc(this._toDoc(id), this.deepPartialInput.parse(input) as UpdateData<Input>)
  }

  async get(id: string | DocumentReference<Input>) {
    const snap = await getDoc(this._toDoc(id))
    return this.parseSnap(snap)
  }

  async getDocs(...queryConstraints: QueryConstraint[]) {
    return getDocs(_query(this.collection, ...queryConstraints))
  }

  onQuerySnapshot(
    query: Query<Input>,
    observer: {
      next?: (_: SimpleQuerySnapshot<Output>) => void
      error?: (_: FirestoreError) => void
      complete?: () => void
    },
    options?: SnapshotListenOptions
  ) {
    const parsedObserver = {
      ...observer,
      next:
        observer.next &&
        ((snap: QuerySnapshot<Input>) => {
          ;(async () => {
            const docs = await Promise.all(snap.docs.map((docSnap) => this.parseSnap(docSnap)))
            observer.next &&
              observer.next({
                docs,
                metadata: snap.metadata,
              })
          })()
        }),
    }

    if (options) {
      return onSnapshot(query, options, parsedObserver)
    }
    return onSnapshot(query, parsedObserver)
  }

  useQuerySnapshot(query: Query<Input>) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [snap, setSnap] = React.useState<SimpleQuerySnapshot<Output> | null>(null)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error, setEeror] = React.useState<FirestoreError | null>(null)

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      return this.onQuerySnapshot(query, {
        next: setSnap,
        error: setEeror,
      })
    }, [query])

    return { snap, error, isLoading: !snap }
  }

  onDocumentSnapshot(
    ref: DocumentReference<Input>,
    observer: {
      next?: (_: SimpleDocumentSnapshot<Output>) => void
      error?: (_: FirestoreError) => void
      complete?: () => void
    },
    options?: SnapshotListenOptions
  ) {
    const parsedObserver = {
      ...observer,
      next:
        observer.next &&
        ((snap: DocumentSnapshot<Input>) => {
          ;(async () => {
            observer.next && observer.next(await this.parseSnap(snap))
          })()
        }),
    }

    if (options) {
      return onSnapshot(ref, options, parsedObserver)
    }
    return onSnapshot(ref, parsedObserver)
  }

  useDocumentSnapshot(ref: DocumentReference<Input>) {
    const [snap, setSnap] =
      // eslint-disable-next-line react-hooks/rules-of-hooks
      React.useState<SimpleDocumentSnapshot<Output> | null>(null)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error, setEeror] = React.useState<FirestoreError | null>(null)

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      this.onDocumentSnapshot(ref, {
        next: setSnap,
        error: setEeror,
      })
      // ref can be unstable even if the path stays the same
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref.path])

    return { snap, error, isLoading: !snap }
  }
}
