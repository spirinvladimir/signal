function immutable (value) {
    try {
        return JSON.parse(JSON.stringify(value))
    } catch (e) {
        return value
    }
}


var stream = cb => {
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


var combine = (streams, cb) =>
    stream(emit => {
        var event = [];
        var fire = false;
        streams.forEach((stream$, i) =>
            stream$.onValue(value => {
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


var map = (stream$, cb) =>
    stream(emit =>
        stream$.onValue(value =>
            cb(value, emit)
        )
    )


module.exports.stream = stream
module.exports.combine = combine
module.exports.map = map
