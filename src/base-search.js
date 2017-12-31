// @flow
const debug = require('debug')('text-stream-search')
import type TextStreamAccumulator from 'text-stream-accumulator'
import type {Search} from './search.js'


// calls the given handler exactly one time
// when text matches the given string
class BaseSearch implements Search {
  accumulator: TextStreamAccumulator
  handler: (?Error) => void
  called: boolean

  constructor(args: {accumulator: TextStreamAccumulator, handler: (?Error) => void, timeout?: number}) {
    this.accumulator = args.accumulator
    this.handler = args.handler
    this.called = false
    if (args.timeout) setTimeout(this._onTimeout, args.timeout)
  }


  // checks for matches
  //
  // Disables after the first match,
  // subsequent calls are ignored
  check (text: string) {
    if (this.called) return
    if (this.matches(text))  this._foundMatch(text)
  }

  getDisplayName(): string {
    throw new Error('implement in subclass')
  }

  matches(text: string): boolean {
    throw new Error('implement in subclass')
  }

  // called when a match is found
  _foundMatch (text: string) {
    debug `found match for ${this.getDisplayName()}`
    this.called = true
    process.nextTick(this.handler)
  }


  // called after a given timeout
  _onTimeout() {
    if (this.called) return
    process.nextTick(() => {
      this.handler(new Error(`Expected '${this.accumulator.toString()}' to include ${this.getDisplayName()}`))
    })
  }
}

module.exports = BaseSearch
