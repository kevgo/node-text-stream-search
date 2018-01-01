// @flow

import type TextStreamAccumulator from 'text-stream-accumulator'

const BaseSearch = require('./base-search')

// calls the given handler exactly one time
// then text matches the given regex
class RegexSearch extends BaseSearch implements Search {
  searchRegexp: RegExp
  constructor (args: {regex: RegExp, accumulator: TextStreamAccumulator, resolve: ResolveFunction, reject: RejectFunction, timeout?: number}) {
    super(args)
    this.searchRegexp = args.regex
  }

  // returns the display name for debug / error messages
  getDisplayName (): string {
    return `regex '${this.searchRegexp.toString()}'`
  }

  // returns whether the given text contains the search text this search is looking for
  matches (text: string): boolean {
    return this.searchRegexp.test(text)
  }
}

module.exports = RegexSearch
