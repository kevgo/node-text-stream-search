import { strict as assert } from "assert"
import delay from "delay"
import { ReadableStream } from "memory-streams"
import { TextStreamSearch } from "../src/text-stream-search"

describe(".waitForText()", function() {
  beforeEach(function() {
    this.stream = new ReadableStream("")
    this.search = new TextStreamSearch(this.stream)
  })

  it("finds matches inside a block of text", async function() {
    const promise = this.search.waitForText("hello")
    this.stream.push("So I said hello to her")
    await promise
  })

  it("finds matches arriving in several blocks of text", async function() {
    const promise = this.search.waitForText("wonderland")
    this.stream.push("won")
    this.stream.push("der")
    this.stream.push("land")
    await promise
  })

  it("finds matches that have already arrived when the search starts", async function() {
    this.stream.push("So I said hello to her")
    const promise = this.search.waitForText("hello")
    await promise
  })

  it("returns the matching text", async function() {
    const promise = this.search.waitForText("hello")
    this.stream.push("So I said hello to her")
    const result = await promise
    assert.equal(result, "hello")
  })

  it("aborts after the given timeout", async function() {
    const promise = this.search.waitForText("hello", 10)
    assert.rejects(
      promise,
      new Error(
        'Text "hello" not found within 10 ms. The captured text so far is:\n'
      )
    )
  })

  it("keeps searching without timeout", async function() {
    const promise = this.search.waitForText("hello")
    let resolved = false
    promise.then(function() {
      resolved = true
    })
    await delay(10)
    assert.equal(resolved, false)
  })

  it("allows multiple concurrent searches", async function() {
    const promise1 = this.search.waitForText("text1")
    let resolved1 = false
    promise1.then(function() {
      resolved1 = true
    })
    const promise2 = this.search.waitForText("text2")
    let resolved2 = false
    promise2.then(function() {
      resolved2 = true
    })
    this.stream.push("text1")
    await delay(0)
    assert.equal(resolved1, true, "promise1 should have resolved")
    assert.equal(resolved2, false, "promise2 should not have resolved")
    this.stream.push("text2")
    await delay(0)
    assert.equal(resolved2, true, "promise2 should have resolved")
  })

  it("allows multiple sequential searches", async function() {
    const promise1 = this.search.waitForText("text1")
    let resolved1 = false
    promise1.then(function() {
      resolved1 = true
    })
    this.stream.push("text1")
    await delay(0)
    assert.equal(resolved1, true, "promise1 should have resolved")

    const promise2 = this.search.waitForText("text2")
    let resolved2 = false
    promise2.then(function() {
      resolved2 = true
    })
    this.stream.push("text2")
    await delay(0)
    assert.equal(resolved2, true, "promise2 should have resolved")
  })
})
