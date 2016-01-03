Feature: Recognizing text in streams

  As a developer
  I want to be notified when a text stream contains a given string
  So that my code has the ability to wait until something that creates output has happened.


  Rules:
  - instantiate a TextStreamSearch instance by providing the stream to observe
  - call "wait" on the TextStreamSearch instance to register a callback
    that should be called only once when the given search term occurs first
  - callbacks that are added later use the already accumulated output


  Scenario: the text stream emits the expected string as one
    Given a TextStreamSearch instance
    And I tell it to wait for "hello"
    When the stream emits "So I said hello to her"
    Then the callback for "hello" fires


  Scenario: the text stream emits the expected string in several pieces
    Given a TextStreamSearch instance
    And I tell it to wait for "hello"
    When the stream emits "So I said hello to her"
    Then the callback for "hello" fires


  Scenario: Calling "wait" when the text stream already contained the expected string
    Given a TextStreamSearch instance
    And the stream emits "So I said hello to her"
    When I tell it to wait for "hello"
    Then the callback for "hello" fires


  Scenario: The expected text stream never contains the search term
    Given a TextStreamSearch instance
    And I tell it to wait for "hello"
    When the stream emits "So I said hi to her"
    Then the callback for "hello" does not fire
