import { setWorldConstructor } from "cucumber"
import vm from "vm"
console.log(vm)
const debug = vm.runInThisContext("")

function CustomWorld() {
  // holds the currently running search promises
  this.promises = {}

  // returns the status of the given promise
  // - {status: 'pending'}
  // - {status: 'fulfilled', value: xxx}
  // - {rejected: 'rejected', error: yyy}
  this.promiseInfo = (promise: Promise<any>) => {
    const mirror = debug.MakeMirror(promise, true)
    if (!mirror.isPromise()) {
      throw new Error("not a promise")
    }
    const status = mirror.status()
    if (status === "pending") {
      return { status }
    }
    const value = mirror.promiseValue().value()
    if (status === "resolved") {
      // fix terminology fuck-up
      return { status: "fulfilled", value }
    } else {
      return { status, error: value }
    }
  }
}

setWorldConstructor(CustomWorld)
