import { Search } from "./types/search"

console.log(111111)

/**
 * SearchList contains all current searches.
 */
export class SearchList extends Array<Search> {
  /**
   * Scan runs all active searches against the stream text that has accumulated so far.
   */
  scan() {
    for (const search of this) {
      search.scan()
    }
  }
}
