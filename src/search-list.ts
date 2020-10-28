import { Search } from "./types/search"

/**
 * SearchList contains all current searches.
 */
export class SearchList extends Array<Search> {
  /**
   * Scan runs all active searches against the stream text that has accumulated so far.
   */
  scan(): void {
    for (const search of this) {
      search.scan()
    }
  }
}
