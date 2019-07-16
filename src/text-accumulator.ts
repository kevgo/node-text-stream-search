/**
 * TextAccumulator collects bits and pieces of textual content
 * received as a sequence of buffers.
 */
export class TextAccumulator extends Array<string> {
  /** ToString returns the currently accumulated text. */
  toString(): string {
    return this.join("")
  }
}
