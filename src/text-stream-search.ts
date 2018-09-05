import deb from "debug"
import TextStreamAccumulator, { ReadableStream } from "text-stream-accumulator"
import RegexSearch from "./searchers/regex-search"
import StringSearch from "./searchers/string-search"
import Search from "./types/search.js"
const debug = deb("text-stream-search")

export default class TextStreamSearch {
  // the output captured so far
  private accumulator: TextStreamAccumulator
  private searches: Search[]

  constructor(stream: ReadableStream) {
    this.searches = []
    stream.on("data", this.onStreamData.bind(this))
    this.accumulator = new TextStreamAccumulator(stream)
  }

  // Returns the full text received from the stream so far
  fullText(): string {
    return this.accumulator.toString()
  }

  reset() {
    this.accumulator.reset()
  }

  // Returns a promise that resolves when the given text shows up in the observed stream
  async waitForText(query: string, timeout?: number) {
    debug(`adding subscription for '${query}'`)
    return new Promise(async (resolve, reject) => {
      const search = new StringSearch(
        query,
        this.accumulator,
        resolve,
        reject,
        timeout
      )
      this.searches.push(search)
      await this.checkSearches()
    })
  }

  // Calls the given handler when the given text shows up in the output
  waitForRegex(query: RegExp, timeout?: number): Promise<void> {
    debug(`adding text search for: ${query.toString()}`)
    return new Promise((resolve, reject) => {
      const search = new RegexSearch(
        query,
        this.accumulator,
        resolve,
        reject,
        timeout
      )
      this.searches.push(search)
      this.checkSearches()
    })
  }

  // Called when new text arrives
  onStreamData(data: string) {
    debug(`receiving text: '${data}'`)

    // need to wait for the next tick to give the accumulator time to update
    process.nextTick(() => {
      this.checkSearches()
    })
  }

  // Looks for new matches in the received text.
  // Called each time the text or search terms change.
  async checkSearches() {
    debug(`checking ${this.searches.length} subscriptions`)
    const text = this.fullText()
    for (const search of this.searches) {
      await search.check(text)
    }
  }
}
