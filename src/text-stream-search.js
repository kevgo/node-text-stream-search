// @flow

const RegexSearch = require('./regex-search')
const StringSearch  = require('./string-search')
const TextStreamAccumulator  = require('text-stream-accumulator')
const debug = require('debug')('text-stream-search')

import type {Search} from './search.js'

class TextStreamSearch {

  _accumulator: TextStreamAccumulator
  _searches: Array<Search>

  constructor (stream: stream$Readable) {
    stream.on('data', this._onStreamData)

    this._searches = []

    // the output captured so far
    this._accumulator = new TextStreamAccumulator(stream)
  }


  // Returns the full text received from the stream so far
  fullText(): string {
    return this._accumulator.toString()
  }


  reset() {
    this._accumulator.reset()
  }


  // Calls the given handler when the given text shows up in the output
  waitForText (query: string, handler: (?Error) => void, timeout?: number) {
    debug(`adding text search for: ${query}`)
    const search = new StringSearch({ accumulator: this._accumulator,
                                      handler,
                                      query,
                                      timeout})
    this._searches.push(search)
    this._checkSearches()
  }


  // Calls the given handler when the given text shows up in the output
  waitForRegex (query: RegExp, handler: (?Error) => void, timeout?: number) {
    debug(`adding text search for: ${query.toString()}`)
    const search = new RegexSearch({ accumulator: this._accumulator,
                                     handler,
                                     regex: query,
                                     timeout })
    this._searches.push(search)
    this._checkSearches()
  }



  // Called when new text arrives
  _onStreamData (data: string) {
    debug(`receiving text: '${data}'`)

    // need to wait for the next tick to give the accumulator time to update
    process.nextTick(() => {
      this._checkSearches()
    })
  }


  // Looks for new matches in the received text.
  // Called each time the text or search terms change.
  _checkSearches() {
    const text = this.fullText()
    for (let search of this._searches) {
      search.check(text)
    }
  }
}



module.exports = TextStreamSearch
