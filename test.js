/* global describe, it */

var assert = require('assert')
var { signal, map, combine } = require('./index')

describe('signal', () => {
  it('should stream from [1, 2, 3] to [1, 2, 3]', done => {
    var from = [1, 2, 3]
    var to = []

    signal(emit => from.forEach(_ => setTimeout(emit, 0, _)))
      .onValue(value => {
        to.push(value)
        if (to.length === from.length) {
          assert.deepStrictEqual(from, to)
          done()
        }
      })
  })
  it('should not call onValue if value is same', done => {
    var from = [1, 2, 2, 3, 3, 3]
    var to = []

    signal(emit => from.forEach(_ => setTimeout(emit, 0, _)))
      .onValue(value => {
        to.push(value)
        if (to.length === 3) {
          assert.deepStrictEqual(to, [1, 2, 3])
          done()
        }
      })
  })
  it('subscribe on value asyc after create signal', done => {
    var from = [1, 2, 3]
    var to = []
    var timeScale = 10
    var signal$ = signal(emit => from.forEach(_ => setTimeout(emit, _ * timeScale, _)))

    setTimeout(
      () =>
        signal$.onValue(value => {
          to.push(value)
          if (to.length === from.length) {
            assert.deepStrictEqual(to, from)
            done()
          }
        }),
      timeScale * (from[0] + from[1]) / 2
    )
  })
  it('map between signals chain', done => {
    var from = [1, 2, 3]
    var to = []

    map(
      signal(emit => from.forEach(_ => setTimeout(emit, 0, _))),
      (value, emit) => emit(value + 1)
    )
      .onValue(value => {
        to.push(value)
        if (to.length === from.length) {
          assert.deepStrictEqual(to, [2, 3, 4])
          done()
        }
      })
  })
  it('async map between signals chain', done => {
    var from = [1, 2, 3]
    var to = []
    var timeScale = 10

    map(
      signal(emit => from.forEach(_ => setTimeout(emit, 0, _))),
      (value, emit) => setTimeout(emit, value * timeScale, value + 1)
    )
      .onValue(value => {
        to.push(value)
        if (to.length === from.length) {
          assert.deepStrictEqual(to, [2, 3, 4])
          done()
        }
      })
  })
  it('combine', done => {
    var from1 = [1, 3]
    var from2 = [2, 4]
    var to = []
    var timeScale = 10

    combine(
      [
        signal(emit => from1.forEach(_ => setTimeout(emit, _ * timeScale, _))),
        signal(emit => from2.forEach(_ => setTimeout(emit, _ * timeScale, _)))
      ],
      (a, b) => Math.max(a || -Infinity, b || -Infinity)
    )
      .onValue(value => {
        to.push(value)
        if (to.length === from1.length + from2.length) {
          assert.deepStrictEqual(to, [1, 2, 3, 4])
          done()
        }
      })
  })
})
