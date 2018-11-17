export default interface Subscription {
  getDisplayName(): string
  matches(text: string): boolean
  check(text: string): void
}
