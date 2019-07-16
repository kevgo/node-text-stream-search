import { TextAccumulator } from "../text-accumulator.js"
import { RejectFunction } from "../types/reject-function.js"
import { ResolveFunction } from "../types/resolve-function.js"
import { Subscription } from "../types/subscription.js"

/**
 * StringSubscription calls the given resolve function exactly once
 * when it finds the given string in the text it monitors.
 * When the given time expires, it calls the given reject function.
 */
export class StringSubscription implements Subscription {
  /** the resolve function to call when the searchText is found */
  resolve: ResolveFunction

  /** the reject function to call when the timeoutDuration is reached */
  reject: RejectFunction

  /** time after which this subscription should abort, in milliseconds */
  timeoutDuration?: number

  /** object containing the text received so far */
  text: TextAccumulator

  /** the search string to look for in the received text */
  searchText: string

  constructor(
    query: string,
    resolve: ResolveFunction,
    reject: RejectFunction,
    text: TextAccumulator,
    timeout?: number
  ) {
    this.resolve = resolve
    this.reject = reject
    this.text = text
    this.searchText = query
    if (timeout != null) {
      this.timeoutDuration = timeout
      setTimeout(this.onTimeout.bind(this), timeout)
    }
  }

  /**
   * Checks the given text for the searchText.
   * Calls the resolve function when it finds it.
   */
  check(text: string) {
    if (text.includes(this.searchText)) {
      this.resolve(this.searchText)
    }
  }

  /** called after this subscription times out */
  private onTimeout() {
    this.reject(
      new Error(
        `Text "${this.searchText}" not found within ${
          this.timeoutDuration
        } ms. The captured text so far is:\n${this.text.toString()}`
      )
    )
  }
}
