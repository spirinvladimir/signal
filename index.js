var signal = cb => {
  var listners = []
  var last = {}
  var started = false

  setTimeout(
    () =>
      cb(value => {// eslint-disable-line
        if (value === last) return
        last = value
        started = true
        listners.forEach(listner => listner(value))
      }),
    0
  )

  return {
    onValue: listner => {
      listners.push(listner)
      started && listner(last)
    }
  }
}

var combine = (signals, cb) =>
  signal(emit => {
    var event = Array(signals.length)
    signals.forEach((signal$, i) =>
      signal$.onValue(value => {
        event[i] = value
        emit(cb.apply(null, event))
      })
    )
  })

var map = (signal$, cb) =>
  signal(emit =>
    signal$.onValue(value =>
      cb(value, emit)
    )
  )

module.exports.signal = signal
module.exports.combine = combine
module.exports.map = map
