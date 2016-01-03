class TextStreamSearch

  (@stream, @options = { verbose: no }) ->
    @stream.on 'data', @_on-output

    # the strings to search for
    @_searches = []

    # the output captured so far
    @_output = ''


  # Calls the given handler when the given text shows up in the output
  wait: (text, handler) ->
    @_searches.push {text, handler}
    @_check-searches!


  # Called when new console output arrives
  _on-output: (data) ~>
    text = data.toString!
    console.log text if @options.verbose
    @_output += text
    @_check-searches!


  # Looks for new matches in the received text.
  # Called each time the text or search terms change.
  _check-searches: ->
    for i from @_searches.length-1 to 0 by -1
      if @_output.includes @_searches[i].text
        @_searches[i].handler!
        @_searches.splice i, 1



module.exports = TextStreamSearch
