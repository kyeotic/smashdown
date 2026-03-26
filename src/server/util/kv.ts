export function makeKey(...parts: string[]) {
  return parts.join(':')
}

export async function listAllValues<T>(kv: KVNamespace, prefix: string): Promise<T[]> {
  const list = await kv.list({ prefix })
  const values = await Promise.all(list.keys.map((k) => kv.get<T>(k.name, 'json')))
  return values.filter((v) => v !== null) as T[]
}

export async function kvCreate<T>(kv: KVNamespace, key: string, value: T): Promise<T> {
  const existing = await kv.get(key)
  if (existing !== null) throw new Error(`Record already exists: ${key}`)
  await kv.put(key, JSON.stringify(value))
  return value
}

export async function kvPut<T>(kv: KVNamespace, key: string, value: T): Promise<T> {
  await kv.put(key, JSON.stringify(value))
  return value
}

export async function kvUpsert<T>(
  kv: KVNamespace,
  key: string,
  merge: (existing: T | null) => T,
): Promise<T> {
  const existing = await kv.get<T>(key, 'json')
  const value = merge(existing)
  await kv.put(key, JSON.stringify(value))
  return value
}
