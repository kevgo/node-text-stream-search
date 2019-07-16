import { SubscriptionList } from "./subscription-list"
import { RegexSubscription } from "./subscriptions/regex-subscription"
import { StringSubscription } from "./subscriptions/string-subscription"
import { TextAccumulator } from "./text-accumulator"
import { SimpleReadableStream } from "./types/simple-readable-stream"

/**
 * TextStreamSearch finds occurrences of a given text or regular expression in a given text stream.
 */
export class TextStreamSearch {
  /** the output captured so far */
  private streamText: TextAccumulator

  /**
   * Subscriptions contains all the requests from users of this library
   * to be notified when a particular text or regex shows up in the text stream.
   */
  private subscriptions: SubscriptionList

  constructor(stream: SimpleReadableStream) {
    this.streamText = new TextAccumulator()
    this.subscriptions = new SubscriptionList()
    stream.on("data", this.onStreamData.bind(this))
  }

  /**
   * Returns a promise that resolves with the matching text
   * when the given text shows up in the observed stream.
   * If a timeout is given, aborts after the given duration.
   */
  waitForText(text: string, timeout?: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.subscriptions.push(
        new StringSubscription(text, resolve, reject, this.streamText, timeout)
      )
      this.subscriptions.checkText(this.streamText.toString())
    })
  }

  /**
   * Returns a promise that resolves with the matching text
   * when the given RegExp shows up in observed stream.
   * If a timeout is given, aborts after the given duration.
   */
  waitForRegex(regex: RegExp, timeout?: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.subscriptions.push(
        new RegexSubscription(regex, resolve, reject, this.streamText, timeout)
      )
      this.subscriptions.checkText(this.streamText.toString())
    })
  }

  /** OnStreamData is called when new text arrives on the input stream. */
  private onStreamData(data: Buffer) {
    this.streamText.push(data.toString())
    this.subscriptions.checkText(this.streamText.toString())
  }
}
