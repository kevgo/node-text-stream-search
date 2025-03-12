import { TextAccumulator } from "../text-accumulator.js"
import { RejectFunction } from "../types/reject-function.js"
import { ResolveFunction } from "../types/resolve-function.js"

/**
 * StringSearch is the search for a particular string in the text stream.
 * The search is over once the string is found.
 * It reports success to the given resolve function once when it finds the query string.
 * When reaching the given timeoutDuration, it abourts the search and calls the given reject function.
 */
export class StringSearch {
  /** the resolve function to call when the searchText is found */
  resolve: ResolveFunction

  /** the reject function to call when the search expires */
  reject: RejectFunction

  /** time after which this search expires and should be aborted, in milliseconds */
  timeoutDuration?: number

  /** the stream content that has accumulated so far */
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
  scan(): void {
    if (this.text.toString().includes(this.searchText)) {
      this.resolve(this.searchText)
    }
  }

  /** called after this subscription times out */
  private onTimeout() {
    this.reject(
      new Error(
        `Text "${this.searchText}" not found within ${this.timeoutDuration ?? -1
        } ms. The captured text so far is:\n${this.text.toString()}`
      )
    )
  }
}
