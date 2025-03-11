import { SearchList } from "./search-list.js"
import { RegexSearch } from "./searches/regex-search.js"
import { StringSearch } from "./searches/string-search.js"
import { TextAccumulator } from "./text-accumulator.js"
import { SimpleReadableStream } from "./types/simple-readable-stream.js"

/**
 * TextStreamSearch searches ReadableStreams for text and regexes.
 */
export default class TextStreamSearch {
  /**
   * Subscriptions contains all the requests from users of this library
   * to be notified when a particular text or regex shows up in the text stream.
   */
  private searchList: SearchList

  /** the output captured so far */
  private streamText: TextAccumulator

  constructor(stream: SimpleReadableStream) {
    this.streamText = new TextAccumulator()
    this.searchList = new SearchList()
    stream.on("data", this.onStreamData.bind(this))
  }

  /** Fulltext returns the complete content captured from this stream so far. */
  fullText(): string {
    return this.streamText.toString()
  }

  /**
   * WaitForRegex returns a promise that resolves with the matching text
   * when the given RegExp shows up in observed stream.
   * If a timeout is given, aborts after the given duration.
   */
  waitForRegex(regex: RegExp, timeout?: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.searchList.push(new RegexSearch(regex, resolve, reject, this.streamText, timeout))
      this.searchList.scan()
    })
  }

  /**
   * WaitForText returns a promise that resolves with the matching text
   * when the given text shows up in the observed stream.
   * If a timeout is given, aborts after the given duration.
   */
  waitForText(text: string, timeout?: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.searchList.push(new StringSearch(text, resolve, reject, this.streamText, timeout))
      this.searchList.scan()
    })
  }

  /** OnStreamData is called when new text arrives on the input stream. */
  private onStreamData(data: Buffer) {
    this.streamText.push(data.toString())
    this.searchList.scan()
  }
}
