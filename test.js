var
    assert = require('assert'),
    {signal, map, combine} = require('./index')

describe('signal', () => {
    it('should stream from [1, 2, 3] to [1, 2, 3]', done => {
        var
            from = [1, 2, 3],
            to = []

        signal(emit => from.forEach(_ => setTimeout(emit, 0, _)))
            .onValue(value => {
                to.push(value)
                if (to.length === from.length) {
                    assert.deepEqual(from, to)
                    done()
                }
            })
    })
    it('should not call onValue if value is same', done => {
        var
            from = [1, 2, 2, 3, 3, 3],
            to = []

        signal(emit => from.forEach(_ => setTimeout(emit, 0, _)))
            .onValue(value => {
                to.push(value)
                if (to.length === 3) {
                    assert.deepEqual(to, [1, 2, 3])
                    done()
                }
            })
    })
    it('subscribe on value asyc after create signal', done => {
        var
            from = [1, 2, 3],
            to = [],
            time_scale = 10

        var signal$ = signal(emit => from.forEach(_ => setTimeout(emit, _ * time_scale, _)))
        setTimeout(
            () =>
                signal$.onValue(value => {
                    to.push(value)
                    if (to.length === from.length) {
                        assert.deepEqual(to, from)
                        done()
                    }
                }),
            time_scale * (from[0] + from[1]) / 2
        )
    })
    it('map between signals chain', done => {
        var
            from = [1, 2, 3],
            to = []

        map(
            signal(emit => from.forEach(_ => setTimeout(emit, 0, _))),
            (value, emit) => emit(value + 1)
        )
            .onValue(value => {
                to.push(value)
                if (to.length === from.length) {
                    assert.deepEqual(to, [2, 3, 4])
                    done()
                }
            })
    })
    it('async map between signals chain', done => {
        var
            from = [1, 2, 3],
            to = [],
            time_scale = 10

        map(
            signal(emit => from.forEach(_ => setTimeout(emit, 0, _))),
            (value, emit) => setTimeout(emit, value * time_scale, value + 1)
        )
            .onValue(value => {
                to.push(value)
                if (to.length === from.length) {
                    assert.deepEqual(to, [2, 3, 4])
                    done()
                }
            })
    })
    it('combine', done => {
        var
            from1 = [1, 3],
            from2 = [2, 4],
            to = [],
            t = 10

        combine(
            [
                signal(emit => from1.forEach(_ => setTimeout(emit, _ * t, _))),
                signal(emit => from2.forEach(_ => setTimeout(emit, _ * t, _))),
            ],
            (a, b) => Math.max(a || -Infinity, b || -Infinity)
        )
            .onValue(value => {
                to.push(value)
                if (to.length === from1.length + from2.length) {
                    assert.deepEqual(to, [1, 2, 3, 4])
                    done()
                }
            })
    })
})
