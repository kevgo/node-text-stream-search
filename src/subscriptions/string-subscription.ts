import { TextAccumulator } from "../text-accumulator.js"
import { RejectFunction } from "../types/reject-function.js"
import { ResolveFunction } from "../types/resolve-function.js"
import { Subscription } from "../types/subscription.js"

/**
 * StringSubscription calls the given handler exactly one time
 * when text matches the given string.
 */
export class StringSubscription implements Subscription {
  resolve: ResolveFunction
  reject: RejectFunction
  timeoutDuration?: number
  text: TextAccumulator
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
   * Checks the given text for matches.
   * Notifies the subscribers of matches found.
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
