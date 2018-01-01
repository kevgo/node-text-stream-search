const {defineSupportCode} = require('cucumber')
const Debug = require('vm').runInDebugContext('Debug');


function CustomWorld() {

  // holds the currently running search promises
  this.promises = {}

  // returns the status of the given promise
  // - {status: 'pending'}
  // - {status: 'fulfilled', value: xxx}
  // - {rejected: 'rejected', error: yyy}
  this.promiseInfo = function(promise) {
    const mirror = Debug.MakeMirror( promise, true )
    if( ! mirror.isPromise() ) throw new Error('not a promise')
    var status = mirror.status()
    if( status === 'pending' ) return { status }
    const value = mirror.promiseValue().value()
    if( status === 'resolved' ) {
      // fix terminology fuck-up
        return {status: 'fulfilled', value}
    } else {
      return { status, error: value }
    }
  }
}

defineSupportCode(function({setWorldConstructor}) {
  setWorldConstructor(CustomWorld)
})
