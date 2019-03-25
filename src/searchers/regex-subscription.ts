import TextStreamAccumulator from "text-stream-accumulator"
import { RejectFunction } from "../types/reject-function.js"
import { ResolveFunction } from "../types/resolve-function.js"
import Subscription from "../types/subscription.js"
import BaseSubscription from "./base-subscription"

// calls the given handler exactly one time
// then text matches the given regex
export default class RegexSubscription extends BaseSubscription
  implements Subscription {
  searchRegexp: RegExp

  constructor(
    regex: RegExp,
    accumulator: TextStreamAccumulator,
    resolve: ResolveFunction,
    reject: RejectFunction,
    timeout?: number
  ) {
    super(accumulator, resolve, reject, timeout)
    this.searchRegexp = regex
  }

  // returns the display name for debug / error messages
  getDisplayName(): string {
    return `regex '${this.searchRegexp.toString()}'`
  }

  // returns whether the given text contains the search text this search is looking for
  matches(text: string): string {
    const matches = text.match(this.searchRegexp)
    if (matches) {
      return matches
    }
  }
}
