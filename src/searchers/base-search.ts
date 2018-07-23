import TextStreamAccumulator from "text-stream-accumulator"
import { RejectFunction } from "../types/reject-function.js"
import { ResolveFunction } from "../types/resolve-function.js"

import deb from "debug"
const debug = deb("text-stream-search")
import delay from "delay"

// calls the given handler exactly one time
// when text matches the given string
export default class BaseSearch {
  accumulator: TextStreamAccumulator
  resolve: ResolveFunction
  reject: RejectFunction

  constructor(
    accumulator: TextStreamAccumulator,
    resolve: ResolveFunction,
    reject: RejectFunction,
    timeout?: number
  ) {
    this.accumulator = accumulator
    this.resolve = resolve
    this.reject = reject
    if (timeout != null) {
      setTimeout(this.onTimeout.bind(this), timeout)
    }
  }

  getDisplayName(): string {
    throw new Error("implement in subclass")
  }

  // called when a match is found
  async foundMatch() {
    debug(`found match for ${this.getDisplayName()}`)
    await delay(1)
    this.resolve()
  }

  // called after a given timeout
  onTimeout() {
    const errorMessage = `Expected '${this.accumulator.toString()}' to include ${this.getDisplayName()}`
    debug(`Timeout: rejecting with error message '${errorMessage}'`)
    this.reject(new Error(errorMessage))
  }
}
