require! {
  './base-search' : BaseSearch
}


# Calls the given handler exactly one time
# when text matches the given string
class StringSearch extends BaseSearch

  ({query: @search-text}) ->
    super ...


  # Returns the display name for debug / error messages
  get-display-name: ->
    "string '#{@search-text}'"


  # Returns whether the given text contains the search text this search is looking for
  matches: (text) ->
    text.includes @search-text


module.exports = StringSearch
