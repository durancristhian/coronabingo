// HTMLMediaElement.played merges overlapping ranges and excludes seeks.
// Replaying the same seconds must not count towards distinct watch coverage.
export function getWatchedFraction(played: TimeRanges, duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) return 0

  let seconds = 0
  for (let i = 0; i < played.length; i += 1) {
    seconds += Math.max(0, Math.min(duration, played.end(i)) - played.start(i))
  }
  return Math.min(1, seconds / duration)
}
