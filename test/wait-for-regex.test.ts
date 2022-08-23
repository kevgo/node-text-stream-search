import { strict as assert } from "assert"
import * as util from "util"
import { ReadableStream } from "memory-streams"
import { TextStreamSearch } from "../src/text-stream-search.js"
const delay = util.promisify(setTimeout)

suite("TextStreamSearch.waitForRegex()")

test("match inside a block of text", async function () {
  const stream = new ReadableStream("")
  const promise = new TextStreamSearch(stream).waitForRegex(/h.*o/)
  stream.push("So I said hello to her")
  const matched = await promise
  assert.equal("hello to", matched)
})

test("match arrives in several blocks of text", async function () {
  const stream = new ReadableStream("")
  const promise = new TextStreamSearch(stream).waitForRegex(/w.*r/)
  stream.push("wo")
  stream.push("nd")
  stream.push("er")
  const matched = await promise
  assert.equal("wonder", matched)
})

test("match has already arrived when the search starts", async function () {
  const stream = new ReadableStream("")
  stream.push("So I said hello to her")
  const matched = await new TextStreamSearch(stream).waitForRegex(/h.*o/)
  assert.equal("hello to", matched)
})

test("aborting after the given timeout", async function () {
  const stream = new ReadableStream("")
  const promise = new TextStreamSearch(stream).waitForRegex(/h.*o/, 10)
  await assert.rejects(promise, new Error("Regex /h.*o/ not found within 10 ms. The captured text so far is:\n"))
})

test("search without timeout", async function () {
  const stream = new ReadableStream("")
  const promise = new TextStreamSearch(stream).waitForRegex(/h.*o/)
  let resolved = false
  void promise.then(function () {
    resolved = true
  })
  await delay(10)
  assert.equal(resolved, false, "should keep searching if not timeout given")
})

test("multiple concurrent searches", async function () {
  const stream = new ReadableStream("")
  const search = new TextStreamSearch(stream)
  const promise1 = search.waitForRegex(/t.*1/)
  let resolved1 = false
  void promise1.then(function () {
    resolved1 = true
  })
  const promise2 = search.waitForRegex(/t.*2/)
  let resolved2 = false
  void promise2.then(function () {
    resolved2 = true
  })
  stream.push("text1")
  await delay(0) // process event queue
  assert.equal(resolved1, true, "promise1 should have resolved")
  assert.equal(resolved2, false, "promise2 should not have resolved")
  stream.push("text2")
  await delay(0) // process event queue
  assert.equal(resolved2, true, "promise2 should have resolved")
})

test("multiple sequential searches", async function () {
  const stream = new ReadableStream("")
  const search = new TextStreamSearch(stream)
  const promise1 = search.waitForRegex(/t.*1/)
  let resolved1 = false
  void promise1.then(function () {
    resolved1 = true
  })
  stream.push("text1")
  await delay(0) // process event queue
  assert.equal(resolved1, true, "promise1 should have resolved")

  const promise2 = search.waitForRegex(/t.*2/)
  let resolved2 = false
  void promise2.then(function () {
    resolved2 = true
  })
  stream.push("text2")
  await delay(0) // process event queue
  assert.equal(resolved2, true, "promise2 should have resolved")
})
