import deb from "debug"
import TextStreamAccumulator, { ReadableStream } from "text-stream-accumulator"
import { RegexSubscription } from "./searchers/regex-subscription"
import { StringSubscription } from "./searchers/string-subscription"
import { Subscription } from "./types/subscription.js"
const debug = deb("text-stream-search")

class TextStreamSearch {
  // the output captured so far
  private accumulator: TextStreamAccumulator

  // requests from users of this library to be notified
  private subscriptions: Subscription[]

  constructor(stream: ReadableStream) {
    this.subscriptions = []
    stream.on("data", this.onStreamData.bind(this))
    this.accumulator = new TextStreamAccumulator(stream)
  }

  // Returns the full text received from the stream so far
  fullText(): string {
    return this.accumulator.toString()
  }

  // Deletes all accumulated text
  reset() {
    this.accumulator.reset()
  }

  // Returns a promise that resolves when the given text shows up in the observed stream.
  // If a timeout iss given, aborts after the given duration.
  async waitForText(text: string, timeout?: number): Promise<string> {
    debug(`adding text subscription: '${text}'`)
    return new Promise(async (resolve, reject) => {
      this.subscriptions.push(
        new StringSubscription(text, this.accumulator, resolve, reject, timeout)
      )
      await this.checkSubscriptions()
    })
  }

  // Calls the given handler with the matching text
  // when the given RegExp shows up in the output
  // If a timeout is given, aborts after the given duration.
  waitForRegex(regex: RegExp, timeout?: number): Promise<string> {
    debug(`adding regex subscription: ${regex.toString()}`)
    return new Promise((resolve, reject) => {
      this.subscriptions.push(
        new RegexSubscription(regex, this.accumulator, resolve, reject, timeout)
      )
      this.checkSubscriptions()
    })
  }

  // Called when new text arrives
  onStreamData(data: Buffer) {
    debug(`receiving from stream: '${data}'`)

    // need to wait for the next tick to give the accumulator time to update
    process.nextTick(() => {
      this.checkSubscriptions()
    })
  }

  // Looks for new matches in the received text.
  // Called each time the text or search terms change.
  async checkSubscriptions() {
    debug(`checking ${this.subscriptions.length} subscriptions`)
    const text = this.fullText()
    for (const search of this.subscriptions) {
      await search.check(text)
    }
  }
}

// Add compatibility with `import TextStreamSearch from '...'`
Object.defineProperty(TextStreamSearch, "__esModule", { value: true })
Object.defineProperty(TextStreamSearch, "default", { value: TextStreamSearch })

export = TextStreamSearch
