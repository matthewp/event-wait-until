let ORIGINAL_TARGET = Symbol('event-wait-until-original-target');

self.eventWaitUntil = function(event) {
  let originalTarget = event.originalTarget || event.target;
  // We need to dispatch on the parent, probably
  let ct = event.currentTarget.parentNode;
  let path = [].slice.call(event.path);
  event.stopPropagation();
  event.preventDefault();

  return function(promise){
    Promise.resolve(promise)
    .then(function(){
      let FancyEvent = class extends Event {
        get path() {
          return path;
        }
        get target() {
          return originalTarget;
        }
        get [ORIGINAL_TARGET]() {
          return originalTarget
        }
      };

      let newEvent = new FancyEvent(event.type, {
        bubbles: event.bubbles,
        cancelable: event.cancelable,
        scoped: event.scoped,
        composed: event.composed
      });

      ct.dispatchEvent(newEvent);
    });
  };
};
