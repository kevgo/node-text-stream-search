debug = require('debug')('text-stream-search')


# Calls the given handler exactly one time
# when text matches the given string
class StringSearch

  (@search-text, @handler) ->
    @called = no


  # Checks for matches in the given text
  #
  # disables after the first match,
  # subsequent calls are ignored
  check: (text) ->
    | @called        =>  return
    | @matches text  =>  @_found-match text


  # Returns whether the given text contains the search text this search is looking for
  matches: (text) ->
    text.includes @search-text


  # called when a match is found
  _found-match: (text) ->
    debug "found match for string '#{@search-text}'"
    @called = yes
    process.next-tick @handler



module.exports = StringSearch
