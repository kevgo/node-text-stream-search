import { strict as assert } from "assert"
import { ReadableStream } from "memory-streams"
import { TextStreamSearch } from "../src/text-stream-search"

describe(".fullText()", function() {
  beforeEach(function() {
    this.stream = new ReadableStream("")
    this.search = new TextStreamSearch(this.stream)
  })

  it("starts empty", function() {
    assert.equal(this.search.fullText(), "")
  })

  it("contains the accumulated text from the stream", async function() {
    this.stream.push("So I said ")
    this.stream.push("hello ")
    this.stream.push("to her")
    assert.equal(this.search.fullText(), "So I said hello to her")
  })
})
