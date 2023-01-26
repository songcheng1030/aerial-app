/* eslint-disable jest/expect-expect */
import fs from 'fs'

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestContext,
} from '@firebase/rules-unit-testing'
import { Firestore } from 'firebase/firestore'
import { RoleCrud } from './crud/role'

const orgId = 'seedco'

const augment = (ctx: RulesTestContext) => {
  const db = ctx.firestore() as unknown as Firestore
  return {
    roleCrud: new RoleCrud(db, orgId),
    ...ctx,
  }
}

const setupTest = async (projectId: string) => {
  const testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: fs.readFileSync('firestore.rules', 'utf8'),
    },
  })

  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const { roleCrud } = augment(ctx)
    await roleCrud.add('user')
    await roleCrud.addAdmin('admin')
  })

  return {
    aerial: augment(
      testEnv.authenticatedContext('aerial', { email: 'alice@aerialops.io', email_verified: true })
    ),
    admin: augment(
      testEnv.authenticatedContext('admin', { email: 'bob@seedco.com', email_verified: true })
    ),
    user: augment(
      testEnv.authenticatedContext('user', { email: 'charlie@seedco.com', email_verified: true })
    ),
    stranger: augment(
      testEnv.authenticatedContext('stranger', {
        email: 'stranger@gmail.com',
        email_verified: true,
      })
    ),
    unauthenticated: augment(testEnv.unauthenticatedContext()),
  }
}

test('Aerial User can do anything', async () => {
  const { aerial } = await setupTest('a')

  await assertSucceeds(aerial.roleCrud.get('user'))
  await assertSucceeds(aerial.roleCrud.get('admin'))
  await assertSucceeds(aerial.roleCrud.add('new'))
  await assertSucceeds(aerial.roleCrud.addAdmin('newAdmin'))
})

test('Admin can do anything', async () => {
  const { admin } = await setupTest('b')

  await assertSucceeds(admin.roleCrud.get('user'))
  await assertSucceeds(admin.roleCrud.get('admin'))
  await assertSucceeds(admin.roleCrud.add('new'))
  await assertSucceeds(admin.roleCrud.addAdmin('newAdmin'))
})

test('Ordinary user can only read their own role', async () => {
  const { user } = await setupTest('c')

  await assertFails(user.roleCrud.get('admin'))
  await assertSucceeds(user.roleCrud.get('user'))
  await assertFails(user.roleCrud.add('new'))
  await assertFails(user.roleCrud.addAdmin('new'))
})

test('Stranger has no access', async () => {
  const { stranger } = await setupTest('d')

  await assertFails(stranger.roleCrud.get('admin'))
  await assertFails(stranger.roleCrud.get('user'))
  await assertFails(stranger.roleCrud.add('new'))
  await assertFails(stranger.roleCrud.addAdmin('new'))
})

test('Unauthenticated has no access', async () => {
  const { unauthenticated } = await setupTest('e')

  await assertFails(unauthenticated.roleCrud.get('admin'))
  await assertFails(unauthenticated.roleCrud.get('user'))
  await assertFails(unauthenticated.roleCrud.add('new'))
  await assertFails(unauthenticated.roleCrud.addAdmin('new'))
})
