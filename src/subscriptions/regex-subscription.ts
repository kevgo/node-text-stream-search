import { TextAccumulator } from "../text-accumulator.js"
import { RejectFunction } from "../types/reject-function.js"
import { ResolveFunction } from "../types/resolve-function.js"
import { Subscription } from "../types/subscription.js"

/**
 * RegexSubscription calls the given handler exactly one time
 * when text matches the given regex.
 */
export class RegexSubscription implements Subscription {
  /** the resolve function to call when the searchText is found */
  resolve: ResolveFunction

  /** the reject function to call when the timeoutDuration is reached */
  reject: RejectFunction

  /** time after which this subscription should abort, in milliseconds */
  timeoutDuration?: number

  /** object containing the text received so far */
  text: TextAccumulator

  /** the search string to look for in the received text */
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
    this.searchRegexp = regex
    if (timeoutDuration != null) {
      this.timeoutDuration = timeoutDuration
      setTimeout(this.onTimeout.bind(this), timeoutDuration)
    }
  }

  /**
   * Checks the given text for occurrences of the searchRegexp.
   * Calls the resolve function when it finds it.
   */
  check(text: string) {
    const matches = text.match(this.searchRegexp)
    if (matches) {
      this.resolve(matches[0])
    }
  }

  /** called after this subscription times out */
  private onTimeout() {
    this.reject(
      new Error(
        `Regex /${this.searchRegexp}/ not found within ${
          this.timeoutDuration
        } ms. The captured text so far is:\n${this.text.toString()}`
      )
    )
  }
}
