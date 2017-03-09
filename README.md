[![Build Status](https://travis-ci.org/matthewp/event-wait-until.svg?branch=master)](https://travis-ci.org/matthewp/event-wait-until)

# event-wait-until

Prevent an event from continuing to propagate up (or down) the down until a Promise has resolved. This is good if you need to do some asynchronous activity before determining if the event should be stopped or prevented.

This is a ponyfill for [this WICG issue](https://discourse.wicg.io/t/waituntil-on-dom-events/2056).

## Install

With [yarn](https://yarnpkg.com/en/):

```shell
yarn add event-wait-until
```

## Example

Here's a simple, and silly, example where we query a Web Worker to determine if the event should be prevented.

```js
anchor.addEventListener('click', ev => {
  eventWaitUntil(ev)(new Promise(resolve => {

    worker.postMessage({question: 'Should this be prevented?'});

    worker.onmessage = function(msg){
      const reply = msg.data.reply;
      if(reply === 'prevent') {
        ev.preventDefault();
      }
      resolve();
    };

  }));
});
```

## API

event-wait-until is a function that is placed on the `window` object as **eventWaitUntil**. The signature is `eventWaitUntil(event) -> fn(promise)`. See the above example.

## License

BSD 2 Clause
