// @flow

const TextStreamSearch  = require('../..')
const {expect}  =require('chai')
const {ReadableStream} = require('memory-streams')
const {wait} = require('wait')
const {Given, When, Then} = require('cucumber')


Given(/^a TextStreamSearch instance$/, function() {
  this.stream = new ReadableStream('')
  this.instance = new TextStreamSearch(this.stream)
})


Given(/^I tell it to wait for "([^"]*)"$/, function(searchTerm) {
  if (!this.calls) this.calls = {}
  if (!this.calls[searchTerm]) this.calls[searchTerm] = 0
  this.handler = (err) => {
    this.err = err
    this.calls[searchTerm] += 1
  }
  this.instance.wait(searchTerm, this.handler)
})


Given(/^I tell it to wait for "([^"]*)" with a timeout of (\d+) milliseconds$/, function(searchTerm, timeout) {
  if (!this.calls) this.calls = {}
  if (!this.calls[searchTerm]) this.calls[searchTerm] = 0
  this.handler = (err) => {
    this.err = err
    this.calls[searchTerm] += 1
  }
  this.instance.wait(searchTerm, this.handler, parseInt(timeout))
})


Given(/^a TextStreamSearch instance with accumulated text$/, function() {
  const stream = new ReadableStream('')
  this.instance = new TextStreamSearch(stream)
  stream.append("hello world")
})


When(/^I tell it to wait for the regular expression "([^"]*)"$/, function(searchTerm) {
  if (!this.calls) this.calls = {}
  if (!this.calls[searchTerm]) this.calls[searchTerm] = 0
  this.handler = (err) => {
    this.err = err
    this.calls[searchTerm] += 1
  }
  this.instance.wait(new RegExp(searchTerm), this.handler)
})


When("calling {string} on that instance", function(method) {
  if (method === 'fullText()') {
    this.result = this.instance.fullText()
  } else{
    throw new Error("unsupport function call: #{method}")
  }
})


When(/^the stream emits "([^"]*)"$/, function(text) {
  this.stream.append(text)
})


When(/^calling the "([^"]*)" method$/, function(methodName) {
  this.instance[methodName]()
})


Then(/^it returns "([^"]*)"$/, function(expectedText) {
  expect(this.result).to.equal(expectedText)
})


Then(/^its accumulated text is empty$/, function() {
  expect(this.instance.fullText()).to.be.empty
})


Then(/^the callback for "([^"]*)" fires(?: only once)?$/, function(searchTerm, done) {
  wait(1, () => {
    expect(this.calls[searchTerm]).to.equal(1)
    expect(this.err).to.be.undefined
    done()
  })
})


Then(/^the callback for "([^"]*)" does not fire$/, function(searchTerm, done) {
  wait(1, () => {
    expect(this.calls[searchTerm]).to.equal(0)
    done()
  })
})


Then(/^the callback for "([^"]*)" does not fire again$/, function(searchTerm, done) {
  wait(1, () => {
    expect(this.calls[searchTerm]).to.equal(1)
    expect(this.err).to.be.undefined
    done()
  })
})


Then(/^within (\d+) milliseconds the callback for "([^"]*)" fires with the error:$/, function (delay, searchTerm, errorMessage, done) {
  wait(parseInt(delay), () => {
    expect(this.calls[searchTerm]).to.equal(1)
    expect(this.err.message).to.eql(errorMessage)
    done()
  })
})


Then(/^within (\d+) milliseconds the callback for "([^"]*)" has not fired again$/, function(delay, searchTerm, done) {
  wait(parseInt(delay), () => {
    expect(this.calls[searchTerm]).to.equal(1)
    expect(this.err).to.be.undefined
    done()
  })
})
