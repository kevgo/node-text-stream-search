import { TextAccumulator } from "../text-accumulator.js"
import { RejectFunction } from "../types/reject-function.js"
import { ResolveFunction } from "../types/resolve-function.js"

/**
 * RegexSearch looks for the given regex in the text stream.
 */
export class RegexSearch {
  /** the resolve function to call when the searchText is found */
  resolve: ResolveFunction

  /** the reject function to call when the search expires */
  reject: RejectFunction

  /** time after which this search expires and should be aborted, in milliseconds */
  timeoutDuration?: number

  /** the stream content that has accumulated so far */
  text: TextAccumulator

  /** the regular expression to look for in the stream text */
  searchRegexp: RegExp

  constructor(
    regex: RegExp,
    resolve: ResolveFunction,
    reject: RejectFunction,
    text: TextAccumulator,
    timeoutDuration?: number
  ) {
    this.resolve = resolve
    this.reject = reject
    this.text = text
    this.searchRegexp = new RegExp(regex)
    if (timeoutDuration != null) {
      this.timeoutDuration = timeoutDuration
      setTimeout(this.onTimeout.bind(this), timeoutDuration)
    }
  }

  /** Scan checks the stream text for occurrences of the searchRegexp. */
  scan(): void {
    const matches = this.searchRegexp.exec(this.text.toString())
    if (matches) {
      this.resolve(matches[0])
    }
  }

  /** OnTimeOut is called after this subscription times out. */
  private onTimeout() {
    this.reject(
      new Error(
        `Regex ${this.searchRegexp.toString()} not found within ${
          this.timeoutDuration ?? -1
        } ms. The captured text so far is:\n${this.text.toString()}`
      )
    )
  }
}
