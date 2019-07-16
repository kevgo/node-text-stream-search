/** Subscription represents a one-time subscription to a string or regex. */
export interface Subscription {
  check(text: string): void
}
