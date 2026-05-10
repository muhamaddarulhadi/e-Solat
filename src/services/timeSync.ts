import { getServerTime } from './prayerApi'

let clockOffset = 0
let synced = false

export async function syncClock(): Promise<void> {
  try {
    const localBefore = Date.now()
    const serverTime = await getServerTime()
    const localAfter = Date.now()
    const localMid = (localBefore + localAfter) / 2
    clockOffset = serverTime.getTime() - localMid
    synced = true
  } catch {
    clockOffset = 0
    synced = false
  }
}

export function getSyncedNow(): Date {
  return new Date(Date.now() + clockOffset)
}

export function isSynced(): boolean {
  return synced
}

export function getOffset(): number {
  return clockOffset
}
