var
    assert = require('assert'),
    {signal, map} = require('./index')

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
    it('map between signals chain', () => {
        var
            to = []

        map(
            signal(emit => [1, 2, 3].forEach(emit)),
            (value, emit) => emit(value + 1)
        )
            .onValue(value => to.push(value) === 3 && assert.deepEqual(to, [2, 3, 4]))
    })
})
