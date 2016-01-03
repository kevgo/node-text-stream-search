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
    @called = no
    @handler = ~> @called = yes
    @instance.wait search-term, @handler



  @When /^the stream emits "([^"]*)"$/, (text) ->
    @stream.append text



  @Then /^the callback for "([^"]*)" fires$/, (search-term) ->
    expect(@called).to.be.true


  @Then /^the callback for "([^"]*)" does not fire$/, (search-term) ->
    expect(@called).to.be.false
