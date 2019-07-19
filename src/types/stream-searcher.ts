/** The interface of stream searching that we implement here. */
export interface StreamSearcher {
  /** Fulltext returns the complete content captured from this stream so far. */
  fullText(): string

  /**
   * WaitForText returns a promise that resolves with the matching text
   * when the given text shows up in the observed stream.
   * If a timeout is given, aborts after the given duration.
   */
  waitForText(text: string, timeout?: number): Promise<string>

  /**
   * WaitForRegex returns a promise that resolves with the matching text
   * when the given RegExp shows up in observed stream.
   * If a timeout is given, aborts after the given duration.
   */
  waitForRegex(regex: RegExp, timeout?: number): Promise<string>
}
