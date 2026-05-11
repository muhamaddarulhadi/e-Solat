// Always use device local time — reliable and matches user's timezone
export function getSyncedNow(): Date {
  return new Date()
}

export function syncClock(): void {
  // no-op: device clock is used directly
}
