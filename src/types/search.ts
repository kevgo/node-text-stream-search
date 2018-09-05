export default interface Search {
  getDisplayName(): string
  matches(text: string): boolean
  check(text: string): void
}
