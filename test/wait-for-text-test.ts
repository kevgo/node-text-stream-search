import { strict as assert } from "assert"
import { ReadableStream } from "memory-streams"
import { TextStreamSearch } from "../src/text-stream-search"
import * as util from "util"
const delay = util.promisify(setTimeout)

suite("TextStreamSearch.waitForText()")

test("match inside a block of text", async function () {
  const stream = new ReadableStream("")
  const promise = new TextStreamSearch(stream).waitForText("hello")
  stream.push("So I said hello to her")
  const matched = await promise
  assert.equal(matched, "hello")
})

test("matches arrives in several blocks of text", async function () {
  const stream = new ReadableStream("")
  const promise = new TextStreamSearch(stream).waitForText("wonderland")
  stream.push("won")
  stream.push("der")
  stream.push("land")
  const matched = await promise
  assert.equal(matched, "wonderland")
})

test("match has already arrived when the search starts", async function () {
  const stream = new ReadableStream("")
  stream.push("So I said hello to her")
  const matched = await new TextStreamSearch(stream).waitForText("hello")
  assert.equal(matched, "hello")
})

test("the given timeout expires", async function () {
  const stream = new ReadableStream("")
  const promise = new TextStreamSearch(stream).waitForText("hello", 10)
  assert.rejects(promise, new Error('Text "hello" not found within 10 ms. The captured text so far is:\n'))
})

test("search without timeout", async function () {
  const stream = new ReadableStream("")
  const promise = new TextStreamSearch(stream).waitForText("hello")
  let resolved = false
  promise.then(function () {
    resolved = true
  })
  await delay(10)
  assert.equal(resolved, false)
})

test("multiple concurrent searches", async function () {
  const stream = new ReadableStream("")
  const search = new TextStreamSearch(stream)
  const promise1 = search.waitForText("text1")
  let resolved1 = false
  promise1.then(function () {
    resolved1 = true
  })
  const promise2 = search.waitForText("text2")
  let resolved2 = false
  promise2.then(function () {
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
  const promise1 = search.waitForText("text1")
  let resolved1 = false
  promise1.then(function () {
    resolved1 = true
  })
  stream.push("text1")
  await delay(0) // process event queue
  assert.equal(resolved1, true, "promise1 should have resolved")

  const promise2 = search.waitForText("text2")
  let resolved2 = false
  promise2.then(function () {
    resolved2 = true
  })
  stream.push("text2")
  await delay(0) // process event queue
  assert.equal(resolved2, true, "promise2 should have resolved")
})
