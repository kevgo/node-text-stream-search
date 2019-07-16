import { strict as assert } from "assert"
import { TextAccumulator } from "../src/text-accumulator"

describe("TextAccumulator", () => {
  beforeEach(function() {
    this.accumulator = new TextAccumulator()
  })

  it("starts out empty", function() {
    assert.equal(this.accumulator.toString(), "")
  })

  it("accumulates received text", function() {
    this.accumulator.push("one")
    this.accumulator.push("two")
    assert.equal(this.accumulator.toString(), "onetwo")
  })
})
