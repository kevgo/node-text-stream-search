Feature: resolve with the matching text

  As a developer
  I want that my stream search returns with the matching text
  So that I can wait for and capture unknown user input in streams.

  Background:
    Given a TextStreamSearch instance

  Scenario: waiting for a RegExp
    Given I tell it to wait for the regular expression "Name: \w+"
    When the stream emits "user input is Name: foo Email: foo@bar.com"
    Then the promise for "Name: \w+" resolves with "Name: foo"
