import Ember from 'ember';

export default Ember.Mixin.create({
  init() {
    this._super(...arguments);

    const stateName = 'state:' + this.stateName;
    const StateFactory = this.container.lookupFactory(stateName);

    if (StateFactory === undefined) {
      throw new TypeError('Unknown StateFactory: `' + stateName + '`');
    }

    this.states = new Ember.MapWithDefault({
      defaultValue: key => this.setupState(StateFactory, key)
    });
  },

  keyPropertyName: 'content',

  setupState(Factory, content) {
    return Factory.create({
      [this.get('keyPropertyName')]: content
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
