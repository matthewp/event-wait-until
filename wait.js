(function(){
  let ORIGINAL_TARGET = Symbol('event-wait-until-original-target');

  self.eventWaitUntil = function(event) {
    let originalTarget = event.originalTarget || event.target;
    // We need to dispatch on the parent, probably
    let ct = event.currentTarget.parentNode;
    let path = event.path ? [].slice.call(event.path) : undefined;
    event.stopPropagation();
    event.preventDefault();

    let propagationStopped = false;
    event.stopPropagation = () => propagationStopped = true;
    let defaultPrevented = false;
    event.preventDefault = () => defaultPrevented = true;

    return function(promise){
      return Promise.resolve(promise)
      .then(function(){
        if(propagationStopped || defaultPrevented) {
          return;
        }

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
})();
