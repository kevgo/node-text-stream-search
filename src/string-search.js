// @flow

const BaseSearch  = require( './base-search')
const debug = require('debug')('text-stream-search:string-search')

import type {Search} from './search.js'
import type TextStreamAccumulator from 'text-stream-accumulator'
import type ResolveFunction from './resolve-function.js'
import type RejectFunction from './reject-function.js'


// Calls the given handler exactly one time
// when text matches the given string
class StringSearch extends BaseSearch implements Search {

  searchText: string
  constructor(args: {query: string, accumulator: TextStreamAccumulator, resolve: ResolveFunction, reject: RejectFunction, timeout?: number}) {
    super(args)
    this.searchText = args.query
  }


  // Returns the display name for debug / error messages
  getDisplayName(): string {
    return `string '${this.searchText}'`
  }


  // Returns whether the given text contains the search text this search is looking for
  matches (text: string): boolean {
    const result = text.includes(this.searchText)
    if (result) {
      debug(`search for '${this.searchText}' found a match in '${text}'`)
    } else {
      debug(`no match in '${text}'`)
    }
    return result
  }
}


module.exports = StringSearch
