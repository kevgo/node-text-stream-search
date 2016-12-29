require! {
  '../..' : TextStreamSearch
  'chai' : {expect}
  'memory-streams' : {ReadableStream}
}


module.exports = ->

  @Given /^a TextStreamSearch instance$/, ->
    @stream = new ReadableStream ''
    @instance = new TextStreamSearch @stream


  @Given /^I tell it to wait for "([^"]*)"$/, (search-term) ->
    @called = 0
    @handler = ~> @called += 1
    @instance.wait search-term, @handler


  @Given /^a TextStreamSearch instance with accumulated text$/ ->
    stream = new ReadableStream ''
    @instance = new TextStreamSearch stream
    stream.append "hello world"


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
    set-immediate ~>
      expect(@called).to.equal 1
      done!


  @Then /^the callback for "([^"]*)" does not fire$/, (search-term, done) ->
    set-immediate ~>
      expect(@called).to.equal 0
      done!
