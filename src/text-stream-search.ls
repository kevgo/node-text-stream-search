require! {
  'text-stream-accumulator' : TextStreamAccumulator
}
debug = require('debug')('text-stream-search')


class TextStreamSearch

  (stream) ->
    stream.on 'data', @_on-data

    # the strings to search for
    @_searches = []

    # the output captured so far
    @_output = new TextStreamAccumulator stream


  # Returns the full text received from the stream so far
  full-text: ->
    @_output.to-string!


  # Calls the given handler when the given text shows up in the output
  wait: (text, handler) ->
    @_searches.push {text, handler}
    @_check-searches!


  # Called when new text arrives
  _on-data: (data) ~>
    debug "add text: '#{data.toString!}'"
    process.next-tick ~>
      @_check-searches!


  # Looks for new matches in the received text.
  # Called each time the text or search terms change.
  _check-searches: ->
    for i from @_searches.length-1 to 0 by -1
      if @_output.toString!.match @_searches[i].text
        debug "found match: '#{@_searches[i].text}'"
        @_searches[i].handler!
        @_searches.splice i, 1

  reset: ->
    @_output.reset!


module.exports = TextStreamSearch
