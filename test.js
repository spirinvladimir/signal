var
    assert = require('assert'),
    {signal} = require('./index')

describe('signal', () => {
    it('should stream from [1, 2, 3] to [1, 2, 3]', () => {
        var
            from = [1, 2, 3],
            to = []

        signal(emit => from.forEach(_ => setTimeout(() => emit(_), _)))
            .onValue(value =>
                to.push(value) === from.length && assert.deepEqual(from, to))
    })
    it('should not call onValue if value is same', () => {
        var
            from = [1, 2, 2, 3, 3, 3],
            to = []

        signal(emit => from.forEach(_ => setTimeout(() => emit(_), _)))
            .onValue(value =>
                to.push(value) === 3 && assert.deepEqual(to, [1, 2, 3]))
    })
    it('subscribe on value asyc after create signal', done => {
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
