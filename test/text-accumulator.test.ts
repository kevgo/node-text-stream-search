import assert from "node:assert/strict"
import { test } from "node:test"

import { TextAccumulator } from "../src/text-accumulator.js"

test("TextAccumulator", function() {
  const accumulator = new TextAccumulator()
  assert.equal(accumulator.toString(), "", "should start out empty")
  accumulator.push("one")
  accumulator.push("two")
  assert.equal(accumulator.toString(), "onetwo")
})
