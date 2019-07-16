Feature: Recognizing text in streams

  As a developer
  I want to be notified when a text stream includes a given string or matches a given regular expression
  So that my code has the ability to wait until something that creates output has happened.


  Rules:
  - instantiate a TextStreamSearch instance by providing the stream to observe
  - call "wait" on the TextStreamSearch instance to register a callback
    that should be called only once when the given search term occurs first
  - callbacks that are added later use the already accumulated output


  Background:
    Given a TextStreamSearch instance


  Scenario: the text stream emits the expected string in one piece
    Given I tell it to wait for "hello"
    When the stream emits "So I said hello to her"
    Then the promise for "hello" resolves


  Scenario: the text stream emits the expected string in several pieces
    Given I tell it to wait for "hello"
    When the stream emits "So I said hel"
    And the stream emits "lo to her"
    Then the promise for "hello" resolves


  Scenario: Calling "wait" when the text stream already emitted the expected string
    Given the stream emits "So I said hello to her"
    When I tell it to wait for "hello"
    Then the promise for "hello" resolves


  Scenario: The expected text stream never contains the search term
    Given I tell it to wait for "hello"
    When the stream emits "So I said hi to her"
    Then the promise for "hello" does not resolve


  Scenario: The expected text stream never contains the search term (with timeout)
    Given I tell it to wait for "hello" with a timeout of 1000 milliseconds
    When the stream emits "So I said hi to her"
    Then within 1500 milliseconds the promise for "hello" rejects with the error:
      """
      string 'hello' not found within 1000 ms. The captured text so far is:
      So I said hi to her
      """


  Scenario: Multiple sequential searches
    When I tell it to wait for "one"
    And the stream emits "one"
    Then the promise for "one" resolves
    When I tell it to wait for "two"
    And the stream emits "two"
    Then the promise for "two" resolves


  Scenario: Multiple concurrent searches
    Given I tell it to wait for "one"
    And I tell it to wait for "two"
    When the stream emits "one"
    Then the promise for "one" resolves
    And the promise for "two" does not resolve
    When the stream emits "two"
    Then the promise for "two" resolves


  Scenario: search for a regular expression
    Given I tell it to wait for the regular expression "online at port \d+"
    When the stream emits "online at port 3000"
    Then the promise for "online at port \d+" resolves
