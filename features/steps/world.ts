import { setWorldConstructor } from "cucumber"

function CustomWorld() {
  // holds the currently running search promises
  this.promises = {}
}

setWorldConstructor(CustomWorld)
