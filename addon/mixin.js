import Ember from 'ember';

export default Ember.Mixin.create({
  init() {
    this._super(...arguments);

    const stateName = 'state:' + this.stateName;

    if (!this.container.has(stateName)) {
      throw new TypeError('Unknown StateFactory: `' + stateName + '`');
    }

    const StateFactory = this.container.lookupFactory(stateName);

    this.states = new Ember.MapWithDefault({
      defaultValue: key => this.setupState(StateFactory, key)
    });
  },

  setupState(Factory, content) {
    return Factory.create({
      container: this.container,
      content
    });
  },

  hasStateFor(key) {
    return this.states.has(key);
  },

  stateFor(key) {
    return this.states.get(key);
  },

  cleanupState(state) {
    state.destroy();
  },

  teardownStateFor(key) {
    const state = this.stateFor(key);

    this.cleanupState(state);
    this.states.delete(key);
  }
});
