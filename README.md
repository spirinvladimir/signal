# Stream
Reactive streams:
- never end
- same value won't emit

## Install
```npm install spirinvladimir/stream```

## API
* .stream(emitter)
* .combine([streams], reducer)
* .map(next)

## Example
```js
var {stream, combine, map} = require('stream')
var a = document.getElementById('a')
var b = document.getElementById('b')

combine(
    [
        stream(emit => a.onchange = () => emit(a.value))
        stream(emit => b.onchange = () => emit(b.value))
    ],
    (a, b) => a + b
).onValue(c => document.title = c)
```
