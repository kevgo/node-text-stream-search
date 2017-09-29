debug = require('debug')('text-stream-search')


# Calls the given handler exactly one time
# when text matches the given string
class BaseSearch

  ({@accumulator, @handler, timeout}) ->
    @called = no
    if timeout
      setTimeout @_on-timeout, timeout


  # Checks for matches
  #
  # disables after the first match,
  # subsequent calls are ignored
  check: (text) ->
    | @called        =>  return
    | @matches text  =>  @_found-match text


  # called when a match is found
  _found-match: (text) ->
    debug "found match for #{@get-display-name!}"
    @called = yes
    process.next-tick @handler


  # called after a given timeout
  _on-timeout: ~>
    | @called => return
    process.next-tick ~>
      @handler new Error("Expected '#{@accumulator.to-string!}' to include #{@get-display-name!}" )


module.exports = BaseSearch
