export interface Subscription {
  getDisplayName(): string
  matches(text: string): string | null
  check(text: string): void
}
