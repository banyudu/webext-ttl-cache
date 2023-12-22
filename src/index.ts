const prefix = 'webext-ttl-cache-'
const storage = chrome.storage.local

const withPrefix = (key: string): string => {
  return `${prefix}${key}`
}

interface WithTTL<T> {
  value: T
  ttl: number // ttl
  expires: number // unix timestamp
}

export const del = async (key: string): Promise<void> => {
  await storage.remove(withPrefix(key))
}

const extract = <T = any>(data: WithTTL<T>): T | undefined => {
  if (!data?.ttl || !data?.expires) {
    return undefined
  }

  if (data.expires < Date.now()) {
    return undefined
  }
  return data.value
}

export const get = async <T = any>(key: string): Promise<T | null> => {
  const realKey = withPrefix(key)
  const data = await storage.get(realKey)
  const result = extract(data[realKey])
  if (result === undefined && data[realKey]) {
    await del(realKey)
  }
  return result
}

export const set = async <T = any>(key: string, value: T, ttl: number): Promise<void> => {
  if (value === undefined) {
    return
  }
  const realKey = withPrefix(key)
  const data: WithTTL<T> = {
    value,
    ttl,
    expires: Date.now() + ttl,
  }
  await storage.set({ [realKey]: data })
}

export const keys = async (): Promise<string[]> => {
  const keys = await storage.get(null)
  return Object.keys(keys).filter((key) => key.startsWith(prefix))
}

export const clear = async (): Promise<void> => {
  const toDelete = await keys()
  await storage.remove(toDelete)
}

export const has = async (key: string): Promise<boolean> => {
  const result = await get(key)
  return result !== undefined
}