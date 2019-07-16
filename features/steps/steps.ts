/* tslint:disable:no-unused-expression */

import { strict as assert } from "assert"
import { Given, Then, When } from "cucumber"
import delay from "delay"
import * as inspect from "es6-promise-inspect"
import { ReadableStream } from "memory-streams"
import { TextStreamSearch } from "../.."

Given(/^a TextStreamSearch instance$/, function() {
  this.stream = new ReadableStream("")
  this.instance = new TextStreamSearch(this.stream)
})

Given(/^a TextStreamSearch instance with accumulated text$/, function() {
  this.stream = new ReadableStream("")
  this.instance = new TextStreamSearch(this.stream)
  this.stream.append("hello world")
})

Given(/^I tell it to wait for "([^"]*)"$/, function(searchTerm) {
  const promise = this.instance.waitForText(searchTerm)
  this.promises[searchTerm] = promise
})

Given(
  /^I tell it to wait for "([^"]*)" with a timeout of (\d+) milliseconds$/,
  function(searchTerm, timeout) {
    this.promises[searchTerm] = this.instance.waitForText(
      searchTerm,
      parseInt(timeout, 10)
    )
  }
)

When(/^I tell it to wait for the regular expression "([^"]*)"$/, function(
  searchTerm
) {
  this.promises[searchTerm] = this.instance.waitForRegex(new RegExp(searchTerm))
})

When("calling the {string} method on that instance", function(methodName) {
  this.result = this.instance[methodName]()
})

When(/^the stream emits "([^"]*)"$/, function(text) {
  this.stream.append(text)
})

Then(/^it returns "([^"]*)"$/, function(expectedText) {
  assert.equal(this.result, expectedText)
})

Then(/^its accumulated text is empty$/, function() {
  assert.equal(this.instance.fullText(), "")
})

Then(/^the promise for "([^"]*)" resolves$/, { timeout: 10 }, async function(
  searchTerm
) {
  const promise = this.promises[searchTerm]
  await promise // if the promise doesn't resolve here, the step will timeout in 10 ms
})

Then(
  /^the promise for "([^"]*)" resolves with "([^"]*)"$/,
  { timeout: 10 },
  async function(searchTerm, expectedResult) {
    const promise = this.promises[searchTerm]
    const actualResult = await promise // if the promise doesn't resolve here, the step will timeout in 10 ms
    assert.equal(actualResult, expectedResult)
  }
)

Then(/^the promise for "([^"]*)" does not resolve/, async function(searchTerm) {
  await delay(10)
  assert.equal(inspect.getStatus(this.promises[searchTerm]), "pending")
})

Then(
  /^within (\d+) milliseconds the promise for "([^"]*)" rejects with the error:$/,
  async function(pause, searchTerm, errorMessage) {
    const promise = this.promises[searchTerm]
    const start = new Date()
    try {
      await promise
    } catch (err) {
      assert.equal(err.message, errorMessage)
      const end = new Date()
      const elapsed = end.getTime() - start.getTime()
      assert.ok(
        elapsed <= parseInt(pause, 10),
        `expected ${elapsed} to be less than ${pause}`
      )
    }
  }
)

Then(
  /^within (\d+) milliseconds the callback for "([^"]*)" has not fired again$/,
  async function(pause, searchTerm) {
    await delay(parseInt(pause, 10))
    const promiseInfo = inspect.getStatus(this.promises[searchTerm])
    assert.equal(promiseInfo, "pending")
  }
)
