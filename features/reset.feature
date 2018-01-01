Feature: Resetting text stream accumulator

  As a developer dealing with streams of content
  I want to be able to clear all previously accumulated text
  So that I may search through only new and relevant data.

  Rules:
  - call ".reset()" on the accumulator to clear it of all previously accumulated text


  Scenario: clear accumulated text stream
    Given a TextStreamSearch instance with accumulated text
    When calling the "reset" method on that instance
    Then its accumulated text is empty
