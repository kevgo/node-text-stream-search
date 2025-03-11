import assert from "node:assert/strict"
import { ReadableStream } from "memory-streams"
import { test } from "node:test"

import TextStreamSearch from "../src/text-stream-search.js"

test("TextStreamSearch.fullText()", function () {
  const stream = new ReadableStream("")
  const search = new TextStreamSearch(stream)
  assert.equal(search.fullText(), "", "should start out empty")
  stream.push("So I said ")
  stream.push("hello ")
  stream.push("to her")
  assert.equal(search.fullText(), "So I said hello to her")
})
