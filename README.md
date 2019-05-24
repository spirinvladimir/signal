# :satellite: Signal

[![Build Status](https://travis-ci.org/spirinvladimir/signal.svg?branch=master)](https://travis-ci.org/spirinvladimir/signal)
[![Coverage Status](https://coveralls.io/repos/github/spirinvladimir/signal/badge.svg?branch=master)](https://coveralls.io/github/spirinvladimir/signal?branch=master)

## micro reactive framework
only **3** functions
    makes you development easy

## Install
```npm install spirinvladimir/signal```

## API
### .signal(emitter)
### .combine([signals], reducer)
### .map(next)

## Example
```js
var {signal, combine, map} = require('signal')
var a = document.getElementById('a')
var b = document.getElementById('b')
var c = document.getElementById('c')

map(
    combine(
        [
            signal(emit => a.onchange = () => emit(a.value)),
            signal(emit => b.onchange = () => emit(b.value))
        ],
        (a, b) => [a, b]
    ),
    ([a, b], emit) => a !== undefined && b !== undefined && emit(a + b)
).onValue(c => document.title = c)
```
