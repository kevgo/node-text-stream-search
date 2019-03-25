import deb from "debug"
import TextStreamAccumulator from "text-stream-accumulator"
import { RejectFunction } from "../types/reject-function.js"
import { ResolveFunction } from "../types/resolve-function.js"
import Subscription from "../types/subscription.js"
import BaseSubscription from "./base-subscription"
const debug = deb("text-stream-search:string-search")

// Calls the given handler exactly one time
// when text matches the given string
export default class StringSubscription extends BaseSubscription
  implements Subscription {
  searchText: string

  constructor(
    query: string,
    accumulator: TextStreamAccumulator,
    resolve: ResolveFunction,
    reject: RejectFunction,
    timeout?: number
  ) {
    super(accumulator, resolve, reject, timeout)
    this.searchText = query
  }

  // Returns the display name for debug / error messages
  getDisplayName(): string {
    return `string '${this.searchText}'`
  }

  // Returns whether the given text contains the search text this search is looking for
  matches(text: string): string {
    const found = text.includes(this.searchText)
    if (found) {
      debug(`search for '${this.searchText}' found a match in '${text}'`)
    } else {
      debug(`no match in '${text}'`)
    }
    return this.searchText
  }
}
