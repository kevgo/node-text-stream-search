Feature: accessing the full output received so far

  As a developer using text-stream-seach to search through a stream
  I want to be able to get the full text content received so far
  So that I can inspect it manually if I want to.

  - call ".fullText()" on a search instance to get the complete text received so far


  Scenario: the instance has received some text already
    Given a TextStreamSearch instance
    And the stream emits "hello world"
    When calling the "fullText" method on that instance
    Then it returns "hello world"
