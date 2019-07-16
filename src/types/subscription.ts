/** Subscription represents a one-time subscription to a string or regex. */
export interface Subscription {
  getDisplayName(): string
  matches(text: string): string | null
  check(text: string): void
}
