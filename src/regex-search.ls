require! {
  './base-search' : BaseSearch
}


# Calls the given handler exactly one time
# when text matches the given regex
class RegexSearch extends BaseSearch

  ({query: @search-regexp}) ->
    super ...


  # Returns the display name for debug / error messages
  get-display-name: ->
    "regex '#{@search-regexp}'"


  # Returns whether the given text contains the search text this search is looking for
  matches: (text) ->
    @search-regexp.test text


module.exports = RegexSearch
