import Ember from 'ember';

class CustomMapWithDefault extends Ember.MapWithDefault {
  constructor(options) {
    super(options);
  }

  /*
  * Overriding the default get function to support the defaultValue function
  * recieving a custom context.
  * Taken from:
  * https://github.com/emberjs/ember.js/blob/6a9c789295/packages/ember-metal/lib/map.js#L467
  */
  get(key, context) {
    var hasValue = this.has(key);

    if (hasValue) {
      return this._super$get(key);
    } else {
      var defaultValue = this.defaultValue.call(context, key);
      this.set(key, defaultValue);
      return defaultValue;
    }
  }
}

export default CustomMapWithDefault;
