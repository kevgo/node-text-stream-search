import TextStreamAccumulator, { ReadableStream } from "text-stream-accumulator"
import { RegexSubscription } from "./searchers/regex-subscription"
import { StringSubscription } from "./searchers/string-subscription"
import { Subscription } from "./types/subscription.js"

/**
 * TextStreamSearch finds occurrences of a given text or regular expression in a given text stream.
 */
export class TextStreamSearch {
  /** the output captured so far */
  private accumulator: TextStreamAccumulator

  /** requests from users of this library to be notified */
  private subscriptions: Subscription[]

  constructor(stream: ReadableStream) {
    this.subscriptions = []
    stream.on("data", this.onStreamData.bind(this))
    this.accumulator = new TextStreamAccumulator(stream)
  }

  /** returns the full text received from the stream so far */
  fullText(): string {
    return this.accumulator.toString()
  }

  /** deletes all accumulated text */
  reset() {
    this.accumulator.reset()
  }

  /**
   * Returns a promise that resolves when the given text shows up in the observed stream.
   * If a timeout is given, aborts after the given duration.
   */
  async waitForText(text: string, timeout?: number): Promise<string> {
    return new Promise(async (resolve, reject) => {
      this.subscriptions.push(
        new StringSubscription(text, this.accumulator, resolve, reject, timeout)
      )
      // TODO: add return here
      this.checkSubscriptions()
    })
  }

  /**
   * Returns a promise that resolves when the given RegExp shows up in observed stream.
   * If a timeout is given, aborts after the given duration.
   */
  waitForRegex(regex: RegExp, timeout?: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.subscriptions.push(
        new RegexSubscription(regex, this.accumulator, resolve, reject, timeout)
      )
      this.checkSubscriptions()
    })
  }

  /** called when new text arrives on the stream */
  private onStreamData() {
    // NOTE: The accumulator accumulates the stream on its own.
    //       We just need to wait for the next tick to give it time to update here.
    process.nextTick(() => {
      this.checkSubscriptions()
    })
  }

  /**
   * Looks for new matches in the received text.
   *
   * Called each time the text or search terms change.
   */
  private async checkSubscriptions() {
    const text = this.fullText()
    for (const subscription of this.subscriptions) {
      await subscription.check(text)
    }
  }
}
