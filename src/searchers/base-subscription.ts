import delay from "delay"
import { TextAccumulator } from "../text-accumulator.js"
import { RejectFunction } from "../types/reject-function.js"
import { ResolveFunction } from "../types/resolve-function.js"

/**
 * BaseSubscription calls the given resolve function when text matches the given string.
 */
export abstract class BaseSubscription {
  resolve: ResolveFunction
  reject: RejectFunction
  timeout?: number
  text: TextAccumulator

  constructor(
    resolve: ResolveFunction,
    reject: RejectFunction,
    text: TextAccumulator,
    timeout?: number
  ) {
    this.resolve = resolve
    this.reject = reject
    this.text = text
    if (timeout != null) {
      this.timeout = timeout
      setTimeout(this.onTimeout.bind(this), timeout)
    }
  }

  /** checks for matches */
  async check(text: string) {
    const match = this.matches(text)
    if (match) {
      await this.foundMatch(match)
    }
  }

  getDisplayName(): string {
    throw new Error("implement in subclass")
  }

  /** called with the matching text when a match is found */
  async foundMatch(text: string) {
    await delay(1)
    this.resolve(text)
  }

  /**
   * Indicates whether the given text contains the pattern this subscription is looking for
   * by returning the matching text or null if there are no matches
   */
  matches(_: string): string | null {
    throw new Error("implement in subclass")
  }

  /** called after a given timeout */
  onTimeout() {
    this.reject(
      new Error(
        `${this.getDisplayName()} not found within ${
          this.timeout
        } ms. The captured text so far is:\n${this.text.toString()}`
      )
    )
  }
}
