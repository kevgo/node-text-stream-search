require! {
  '../..' : TextStreamSearch
  'chai' : {expect}
  'memory-streams' : {ReadableStream}
  'wait' : {wait}
}


module.exports = ->

  @Given /^a TextStreamSearch instance$/, ->
    @stream = new ReadableStream ''
    @instance = new TextStreamSearch @stream


  @Given /^I tell it to wait for "([^"]*)"$/, (search-term) ->
    (@calls or= {})[search-term] or= 0
    @handler = ~> @calls[search-term] += 1
    @instance.wait search-term, @handler


  @Given /^a TextStreamSearch instance with accumulated text$/ ->
    stream = new ReadableStream ''
    @instance = new TextStreamSearch stream
    stream.append "hello world"


  @When /^I tell it to wait for the regular expression "([^"]*)"$/ (search-term) ->
    (@calls or= {})[search-term] or= 0
    @handler = ~> @calls[search-term] += 1
    @instance.wait new RegExp(search-term), @handler


  @When /^calling 'fullText\(\)' on that instance$/, ->
    @result = @instance.full-text!


  @When /^the stream emits "([^"]*)"$/, (text) ->
    @stream.append text


  @When /^calling the "([^"]*)" method$/ (method-name) ->
    @instance[method-name]!


  @Then /^it returns "([^"]*)"$/, (expected-text) ->
    expect(@result).to.equal expected-text


  @Then /^its accumulated text is empty$/ ->
    expect(@instance.full-text!).to.be.empty


  @Then /^the callback for "([^"]*)" fires(?: only once)?$/, (search-term, done) ->
    wait 1, ~>
      expect(@calls[search-term]).to.equal 1
      done!


  @Then /^the callback for "([^"]*)" does not fire$/, (search-term, done) ->
    wait 1, ~>
      expect(@calls[search-term]).to.equal 0
      done!


  @Then /^the callback for "([^"]*)" does not fire again$/ (search-term, done) ->
    wait 1, ~>
      expect(@calls[search-term]).to.equal 1
      done!
