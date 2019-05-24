var
    assert = require('assert'),
    {
        signal,
        signal_changes,
        combine,
        map
    } = require('./index')

describe('signal', () => {
    describe('signal', () => {
        it('should stream [1, 2, 3] to [1, 2, 3]', () => {
            var
                from = [1, 2, 3],
                to = []

            signal(emit => from.forEach(_ => setTimeout(() => emit(_), _)))
                .onValue(value =>
                    to.push(value) === from.length && assert.deepEqual(from, to))
        })
        it('subscribe asyc from creat signal', done => {
            var
                from = [1, 2, 3],
                to = [],
                time_scale = 10

            var signal$ = signal(emit => from.forEach(_ => setTimeout(() => emit(_), _ * time_scale)))
            setTimeout(
                () =>
                    signal$.onValue(value =>
                        to.push(value) === from.length && assert.deepEqual(to, from) || done()),
                time_scale * (from[0] + from[1]) / 2
            )
        })
    })
})
