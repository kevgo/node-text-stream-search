debug = require('debug')('text-stream-search')


# Calls the given handler exactly one time
# when text matches the given regex
class RegexSearch

  (@search-regexp, @handler) ->
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
    @search-regexp.test text


  # called when a match is found
  _found-match: (text) ->
    debug "found match for regex '#{@search-regexp}'"
    @called = yes
    process.next-tick @handler



module.exports = RegexSearch
