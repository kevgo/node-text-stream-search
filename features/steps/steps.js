// @flow

const delay = require('delay')
const TextStreamSearch  = require('../..')
const {expect}  =require('chai')
const {ReadableStream} = require('memory-streams')
const {wait} = require('wait')
const {Given, When, Then} = require('cucumber')


Given(/^a TextStreamSearch instance$/, function() {
  this.stream = new ReadableStream('')
  this.instance = new TextStreamSearch(this.stream)
})


Given(/^a TextStreamSearch instance with accumulated text$/, function() {
  this.stream = new ReadableStream('')
  this.instance = new TextStreamSearch(this.stream)
  this.stream.append("hello world")
})


Given(/^I tell it to wait for "([^"]*)"$/, function(searchTerm) {
  const promise = this.instance.waitForText(searchTerm)
  this.promises[searchTerm] = promise
})


Given(/^I tell it to wait for "([^"]*)" with a timeout of (\d+) milliseconds$/, function(searchTerm, timeout) {
  this.promises[searchTerm] = this.instance.waitForText(searchTerm, parseInt(timeout))
})


When(/^I tell it to wait for the regular expression "([^"]*)"$/, function(searchTerm) {
  this.promises[searchTerm] = this.instance.waitForRegex(new RegExp(searchTerm))
})


When('calling the {string} method on that instance', function(methodName) {
  this.result = this.instance[methodName]()
})


When(/^the stream emits "([^"]*)"$/, function(text) {
  this.stream.append(text)
})


Then(/^it returns "([^"]*)"$/, function(expectedText) {
  expect(this.result).to.equal(expectedText)
})


Then(/^its accumulated text is empty$/, function() {
  expect(this.instance.fullText()).to.be.empty
})


Then(/^the promise for "([^"]*)" resolves$/, {timeout: 10}, async function(searchTerm) {
  const promise = this.promises[searchTerm]
  await promise   // if the promise doesn't resolve here, the step will timeout in 10 ms
})


Then(/^the promise for "([^"]*)" does not resolve/, async function(searchTerm) {
  await delay(10)
  expect(this.promiseInfo(this.promises[searchTerm]).status).to.equal('pending')
})


Then(/^within (\d+) milliseconds the promise for "([^"]*)" rejects with the error:$/, async function (pause, searchTerm, errorMessage) {
  const promise = this.promises[searchTerm]
  try {
    await promise
  } catch (err) {
    expect(err.message).to.equal(errorMessage)
  }
})


Then(/^within (\d+) milliseconds the callback for "([^"]*)" has not fired again$/, async function(pause, searchTerm) {
  await delay(parseInt(pause))
  const promiseInfo = this.promiseInfo(this.promises[searchTerm])
  expect(promiseInfo.status).to.equal('pending')
})
