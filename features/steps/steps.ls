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



  @When /^the stream emits "([^"]*)"$/, (text) ->
    @stream.append text



  @Then /^the callback for "([^"]*)" fires(?: only once)?$/, (search-term) ->
    set-immediate ~>
      expect(@called).to.equal 1


  @Then /^the callback for "([^"]*)" does not fire$/, (search-term) ->
    set-immediate ~>
      expect(@called).to.equal 0
