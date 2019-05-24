# Signal

[![Build Status](https://travis-ci.org/spirinvladimir/signal.svg?branch=master)](https://travis-ci.org/spirinvladimir/signal)

Signal is a reactive stream which:
- never end
- same value won't emit

## Install
```npm install spirinvladimir/signal```

## API
* .signal(emitter)
* .signal_changes([signals], reducer)
* .combine([signals], reducer)
* .map(next)

## Example
```js
var {signal, combine, map} = require('signal')
var a = document.getElementById('a')
var b = document.getElementById('b')

combine(
    [
        signal(emit => a.onchange = () => emit(a.value))
        signal(emit => b.onchange = () => emit(b.value))
    ],
    (a, b) => a + b
).onValue(c => document.title = c)
```
