require! {
  './regex-search' : RegexSearch
  './string-search' : StringSearch
  'text-stream-accumulator' : TextStreamAccumulator
}
debug = require('debug')('text-stream-search')


class TextStreamSearch

  (stream) ->
    stream.on 'data', @_on-stream-data

    @_searches = []

    # the output captured so far
    @_accumulator = new TextStreamAccumulator stream


  # Returns the full text received from the stream so far
  full-text: ->
    @_accumulator.to-string!


  reset: ->
    @_accumulator.reset!


  # Calls the given handler when the given text shows up in the output
  wait: (text, handler) ->
    debug "adding search for: #{text}"
    @_searches.push @_create-search-instance text, handler
    @_check-searches!


  _create-search-instance: (text, handler) ->
    switch (text-type = typeof! text)
      | 'String'  =>  new StringSearch text, handler
      | 'RegExp'  =>  new RegexSearch text, handler
      | _         =>  throw new Error "unknown data type to wait for: #{text-type}"


  # Called when new text arrives
  _on-stream-data: (data) ~>
    debug "receiving text: '#{data.toString!}'"

    # need to wait for the next tick to give the accumulator time to update
    process.next-tick ~>
      @_check-searches!


  # Looks for new matches in the received text.
  # Called each time the text or search terms change.
  _check-searches: ->
    text = @full-text!
    for search in @_searches
      search.check text



module.exports = TextStreamSearch
