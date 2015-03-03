import Ember from 'ember';

export default Ember.Mixin.create({
  init: function() {
    this._super.apply(this, arguments);

    var service = this;
    var container = this.container;
    var stateName = 'state:' + this.stateName;

    if (!container.has(stateName)) {
      throw new TypeError('Unknown StateFactory: `' + stateName + '`');
    }

    var StateFactory = this.container.lookupFactory(stateName);

    this.states = new Ember.MapWithDefault({
      defaultValue: function(key) {
        return service.setupState(StateFactory, key);
      }
    });
  },

  setupState: function(factory, key) {
    return factory.create({
      content: key
    });
  },

  hasStateFor: function(key) {
    return this.states.has(key);
  },

  stateFor: function(key) {
    return this.states.get(key);
  },

  cleanupState: function(state) {
    state.destroy();
  },

  teardownStateFor: function(key) {
    var state = this.stateFor(key);

    this.cleanupState(state);
    this.states.delete(key);
  }
});
