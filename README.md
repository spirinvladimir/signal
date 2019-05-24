# :satellite: Signal

[![Build Status](https://travis-ci.org/spirinvladimir/signal.svg?branch=master)](https://travis-ci.org/spirinvladimir/signal)
[![Coverage Status](https://coveralls.io/repos/github/spirinvladimir/signal/badge.svg?branch=master)](https://coveralls.io/github/spirinvladimir/signal?branch=master)

## micro reactive framework:
with only **4** functions

You do emit - signal produce function callChanges

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
