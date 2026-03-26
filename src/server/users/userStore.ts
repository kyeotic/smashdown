import { differenceBy } from 'lodash'
import { listAllValues, makeKey, kvCreate, kvPut } from '../util/kv'
import type { JWTPayload } from 'jose'
import { nanoid } from 'nanoid'

const AUTH0_SOURCE = 'auth0-kyeotek'

export interface User {
  id: string
  displayName?: string
  externalIds?: ExternalId[]
}

export interface ExternalId {
  source: string
  id: string
}

interface ExternalIdRef {
  userId: string
}

export default class UserStore {
  constructor(private readonly kv: KVNamespace) {}

  async getAll(): Promise<User[]> {
    return await listAllValues<User>(this.kv, 'USERS:')
  }

  async create(user: User): Promise<User> {
    if (!user.id) throw new Error('id is required')
    validateExternals(user)

    const key = makeKey('USERS', user.id)
    await kvCreate(this.kv, key, user)

    await Promise.all(
      (user.externalIds ?? []).map((e) =>
        kvPut<ExternalIdRef>(this.kv, makeKey('EX_ID', e.source, e.id), { userId: user.id }),
      ),
    )

    return user
  }

  async initUser(token: JWTPayload): Promise<User> {
    const externalId = token.sub
    if (!externalId) throw new Error('Token missing sub claim')

    const dbUser = await this.getByExternalIdentifier(AUTH0_SOURCE, externalId)
    if (dbUser) return dbUser

    const newUser: User = {
      id: nanoid(),
      externalIds: [{ source: AUTH0_SOURCE, id: externalId }],
    }

    await this.create(newUser)

    return newUser
  }

  async update(user: User): Promise<User> {
    if (!user.id) throw new Error('id is required')
    validateExternals(user)

    const key = makeKey('USERS', user.id)
    const existing = await this.kv.get<User>(key, 'json')

    if (!existing) {
      throw new Error('User not found')
    }

    await kvPut(this.kv, key, user)

    const newExternals = differenceBy(
      user.externalIds ?? [],
      existing.externalIds ?? [],
      (e) => `${e.source}:${e.id}`,
    )
    const removedExternals = differenceBy(
      existing.externalIds ?? [],
      user.externalIds ?? [],
      (e) => `${e.source}:${e.id}`,
    )

    await Promise.all([
      ...newExternals.map((e) =>
        kvPut<ExternalIdRef>(this.kv, makeKey('EX_ID', e.source, e.id), { userId: user.id }),
      ),
      ...removedExternals.map((e) => this.kv.delete(makeKey('EX_ID', e.source, e.id))),
    ])

    return user
  }

  async getByExternalIdentifier(source: string, externalId: string): Promise<User | null> {
    const ref = await this.kv.get<ExternalIdRef>(makeKey('EX_ID', source, externalId), 'json')
    if (!ref) return null

    return await this.kv.get<User>(makeKey('USERS', ref.userId), 'json')
  }
}

function validateExternals(user: User) {
  if ((user.externalIds?.length ?? 0) > 5) throw new Error('Max of 5 external ids')
}
