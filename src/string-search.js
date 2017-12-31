// @flow

import BaseSearch  from './base-search'
import type {Search} from './search.js'
import type TextStreamAccumulator from 'text-stream-accumulator'


// Calls the given handler exactly one time
// when text matches the given string
class StringSearch extends BaseSearch implements Search {

  searchText: string
  constructor(args: {query: string, accumulator: TextStreamAccumulator, handler: (?Error) => void, timeout?: number}) {
    super(args)
    this.searchText = args.query
  }


  // Returns the display name for debug / error messages
  getDisplayName(): string {
    return `string '${this.searchText}'`
  }


  // Returns whether the given text contains the search text this search is looking for
  matches (text: string): boolean {
    return text.includes(this.searchText)
  }
}


module.exports = StringSearch
