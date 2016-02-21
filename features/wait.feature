Feature: Recognizing text in streams

  As a developer
  I want to be notified when a text stream contains a given string
  So that my code has the ability to wait until something that creates output has happened.


  Rules:
  - instantiate a TextStreamSearch instance by providing the stream to observe
  - call "wait" on the TextStreamSearch instance to register a callback
    that should be called only once when the given search term occurs first
  - callbacks that are added later use the already accumulated output


  Background:
    Given a TextStreamSearch instance


  Scenario: the text stream emits the expected string in one piece
    When I tell it to wait for "hello"
    And the stream emits "So I said hello to her"
    Then the callback for "hello" fires


  Scenario: the text stream emits the expected string in several pieces
    When I tell it to wait for "hello"
    And the stream emits "So I said hel"
    And the stream emits "lo to her"
    Then the callback for "hello" fires


  Scenario: Calling "wait" when the text stream already emitted the expected string
    When the stream emits "So I said hello to her"
    And I tell it to wait for "hello"
    Then the callback for "hello" fires


  Scenario: the text stream emits the expected string multiple times
    When I tell it to wait for "hello"
    And the stream emits "So I said hello to her"
    And the stream emits "And I said hello to her again"
    Then the callback for "hello" fires only once


  Scenario: The expected text stream never contains the search term
    When I tell it to wait for "hello"
    And the stream emits "So I said hi to her"
    Then the callback for "hello" does not fire
