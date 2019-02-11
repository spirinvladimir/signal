function immutable (value) {
    try {
        return JSON.parse(JSON.stringify(value))
    } catch (e) {
        return value
    }
}


var signal = cb => {
    var
        listners = [],
        last,
        started = false;
    setTimeout(
        () =>
            cb(value => {
                if (value === last) return;//combine requirement
                last = value;
                started = true;
                listners.forEach(listner => listner(immutable(value)))
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
        var event = [];
        var fire = false;
        signals.forEach((signal$, i) =>
            signal$.onValue(value => {
                event[i] = value
                if (fire) {
                    emit(cb.apply(null, event))
                } else {
                    fire = event.findIndex(v => typeof v === 'undefined') === -1;
                    if (fire) {
                        emit(cb.apply(null, event))
                    }
                }
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
